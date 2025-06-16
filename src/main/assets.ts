import fs from 'fs';
import path from 'path';
import { app as electronApp } from 'electron';
import type { Protocol, IpcMain } from 'electron';
import os from 'os';
import unzipper from 'unzipper';
import { ProjectMetadataSchema } from '../shared/project';
import { generatePackIcon } from './icon';

/** URL pointing to Mojang's version manifest which lists all official releases. */
const VERSION_MANIFEST =
  'https://launchermeta.mojang.com/mc/game/version_manifest.json';

/** Base directory used to store cached client JARs and extracted assets. */
const basePath = electronApp?.getPath
  ? electronApp.getPath('userData')
  : os.tmpdir();
/** Directory that contains one sub folder per Minecraft version. */
const cacheDir = path.join(basePath, 'assets-cache');

// Paths used by the custom asset and vanilla protocols. These are updated when
// a project is opened so the protocols can resolve relative texture URLs.
let cacheTexturesDir = '';
// Base path for the currently active project used by the asset protocol.
let activeProjectDir = '';

/**
 * Fetch a JSON document from the given URL.
 *
 * The request is performed using `fetch` and the body parsed as JSON. When the
 * manifest URL is requested and the network is unavailable, a bundled copy is
 * used as a fallback.
 *
 * @throws if the request fails.
 */
async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json() as Promise<T>;
  } catch (err) {
    // Fall back to a bundled manifest when offline
    if (url === VERSION_MANIFEST) {
      const local = path.join(__dirname, '../shared/version_manifest.json');
      const data = await fs.promises.readFile(local, 'utf-8');
      return JSON.parse(data) as T;
    }
    throw err;
  }
}

/**
 * Download a file from the given URL and write it to disk.
 *
 * The target directory is created if it does not exist. The body is saved as a
 * binary buffer so any file type can be retrieved.
 */
async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const array = new Uint8Array(await res.arrayBuffer());
  await fs.promises.writeFile(dest, array);
}

/**
 * Extract all files from a zip archive to the given directory.
 *
 * The operation streams the archive to disk to avoid buffering large files in
 * memory.
 */
async function extractZip(src: string, dest: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(src)
      .pipe(unzipper.Extract({ path: dest }))
      .on('close', resolve)
      .on('error', reject);
  });
}

/**
 * Ensure that the assets for the given Minecraft version are available locally.
 *
 * Algorithm:
 * 1. Build a version specific cache directory and check if textures already
 *    exist.
 * 2. If present return the path immediately.
 * 3. Otherwise download the corresponding client JAR from Mojang using the
 *    version manifest.
 * 4. Extract the JAR into the cache so individual textures can be accessed.
 *
 * @param version Minecraft version string, e.g. `1.21.1`.
 * @returns Absolute path to the extracted client folder containing `assets/`.
 * @throws If the version cannot be resolved or downloads fail.
 */
async function ensureAssets(version: string): Promise<string> {
  const base = path.join(cacheDir, version);
  const assetsPath = path.join(base, 'client');
  const texDir = path.join(assetsPath, 'assets', 'minecraft', 'textures');
  if (fs.existsSync(texDir)) return assetsPath;

  await fs.promises.mkdir(base, { recursive: true });
  const manifest = await fetchJson<{
    versions: Array<{ id: string; url: string }>;
  }>(VERSION_MANIFEST);
  const entry = manifest.versions.find((v) => v.id === version);
  if (!entry) throw new Error(`Version ${version} not found`);
  const ver = await fetchJson<{ downloads: { client: { url: string } } }>(
    entry.url
  );
  const jarUrl = ver.downloads.client.url;
  const jarPath = path.join(base, 'client.jar');
  if (!fs.existsSync(jarPath)) await downloadFile(jarUrl, jarPath);
  await extractZip(jarPath, assetsPath);
  return assetsPath;
}

export { fetchJson, downloadFile, ensureAssets };

/**
 * Fetch the official Minecraft version manifest and return the list of
 * available version IDs.
 */
export async function listVersions(): Promise<string[]> {
  const manifest = await fetchJson<{ versions: Array<{ id: string }> }>(
    VERSION_MANIFEST
  );
  return manifest.versions.map((v) => v.id);
}

/**
 * Recursively list all texture paths available for the given project version.
 */
export async function listTextures(projectPath: string): Promise<string[]> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const root = await ensureAssets(meta.version);
  const texRoot = path.join(root, 'assets', 'minecraft', 'textures');
  const out: string[] = [];
  const walk = async (dir: string) => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(p);
      } else if (entry.name.endsWith('.png')) {
        const rel = path.relative(texRoot, p);
        out.push(rel.split(path.sep).join('/'));
      }
    }
  };
  await walk(texRoot);
  return out;
}

/**
 * Copy the given texture from the cached client into the project directory and
 * update the project's metadata so it will be packaged.
 */
export async function addTexture(
  projectPath: string,
  texture: string
): Promise<void> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const root = await ensureAssets(meta.version);
  const src = path.join(root, 'assets', 'minecraft', 'textures', texture);
  const dest = path.join(
    projectPath,
    'assets',
    'minecraft',
    'textures',
    texture
  );
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
  meta.assets.push(`assets/minecraft/textures/${texture}`);
  await fs.promises.writeFile(metaPath, JSON.stringify(meta, null, 2));
}

/**
 * Return the absolute path to a cached texture for the given project.
 */
export async function getTexturePath(
  projectPath: string,
  texture: string
): Promise<string> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const root = await ensureAssets(meta.version);
  return path.join(root, 'assets', 'minecraft', 'textures', texture);
}

/**
 * Convert a texture path into a URL that uses the custom `vanilla://` protocol
 * so the renderer can load the image without exposing file paths.
 */
export async function getTextureURL(
  projectPath: string,
  texture: string
): Promise<string> {
  // Record paths used by the protocol so it can resolve this texture later
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const cacheRoot = await ensureAssets(meta.version);
  cacheTexturesDir = path.join(cacheRoot, 'assets', 'minecraft', 'textures');
  return `vanilla://${texture}`;
}

/**
 * Register the `vanilla` protocol so it serves files directly from disk.
 */
export function registerVanillaProtocol(protocol: Protocol) {
  protocol.registerFileProtocol('vanilla', (request, callback) => {
    const rel = decodeURI(request.url.replace('vanilla://', ''));
    const cacheFile = cacheTexturesDir ? path.join(cacheTexturesDir, rel) : '';
    callback(cacheFile);
  });
}

/** Register the `asset` protocol to serve files from the active project. */
export function registerAssetProtocol(protocol: Protocol) {
  protocol.registerFileProtocol('asset', (request, callback) => {
    const rel = decodeURI(request.url.replace('asset://', ''));
    const file = activeProjectDir ? path.join(activeProjectDir, rel) : '';
    callback(file);
  });
}

/** Update the directories used by the custom protocols for the active project. */
export async function setActiveProject(projectPath: string): Promise<void> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(await fs.promises.readFile(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const cacheRoot = await ensureAssets(meta.version);
  cacheTexturesDir = path.join(cacheRoot, 'assets', 'minecraft', 'textures');
  activeProjectDir = projectPath;
}

export function registerAssetHandlers(ipc: IpcMain) {
  ipc.handle('add-texture', (_e, projectPath: string, texture: string) => {
    return addTexture(projectPath, texture);
  });

  ipc.handle('list-textures', (_e, projectPath: string) => {
    return listTextures(projectPath);
  });

  ipc.handle('get-texture-path', (_e, projectPath: string, tex: string) => {
    return getTexturePath(projectPath, tex);
  });

  ipc.handle('get-texture-url', (_e, projectPath: string, tex: string) => {
    return getTextureURL(projectPath, tex);
  });

  ipc.handle('randomize-icon', (_e, projectPath: string) => {
    return generatePackIcon(projectPath);
  });
}
