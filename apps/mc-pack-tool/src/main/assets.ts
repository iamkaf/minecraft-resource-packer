import fs from 'fs';
import path from 'path';
import { app as electronApp } from 'electron';
import type { Protocol } from 'electron';
import os from 'os';
import unzipper from 'unzipper';
import { ProjectMetadataSchema } from '../minecraft/project';

/** URL pointing to Mojang's version manifest which lists all official releases. */
const VERSION_MANIFEST =
  'https://launchermeta.mojang.com/mc/game/version_manifest.json';

/** Base directory used to store cached client JARs and extracted assets. */
const basePath = electronApp?.getPath
  ? electronApp.getPath('userData')
  : os.tmpdir();
/** Directory that contains one sub folder per Minecraft version. */
const cacheDir = path.join(basePath, 'assets-cache');

// Paths used by the custom texture protocol. These are updated when a project
// is opened so the protocol can resolve relative texture URLs.
let projectTexturesDir = '';
let cacheTexturesDir = '';

/**
 * Fetch a JSON document from the given URL.
 * @throws if the request fails.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

/**
 * Download a file from the given URL and write it to disk.
 */
async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const array = new Uint8Array(await res.arrayBuffer());
  await fs.promises.writeFile(dest, array);
}

/**
 * Ensure that the assets for the given Minecraft version are downloaded and
 * extracted. Returns the path to the extracted client folder.
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
  await new Promise((resolve, reject) => {
    fs.createReadStream(jarPath)
      .pipe(unzipper.Extract({ path: assetsPath }))
      .on('close', resolve)
      .on('error', reject);
  });
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
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const root = await ensureAssets(meta.version);
  const texRoot = path.join(root, 'assets', 'minecraft', 'textures');
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
      } else if (entry.name.endsWith('.png')) {
        const rel = path.relative(texRoot, p);
        out.push(rel.split(path.sep).join('/'));
      }
    }
  };
  walk(texRoot);
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
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
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
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  // Update the cached project texture directory to ensure thumbnails work
  projectTexturesDir = path.join(
    projectPath,
    'assets',
    'minecraft',
    'textures'
  );
}

/**
 * Return the absolute path to a cached texture for the given project.
 */
export async function getTexturePath(
  projectPath: string,
  texture: string
): Promise<string> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const root = await ensureAssets(meta.version);
  return path.join(root, 'assets', 'minecraft', 'textures', texture);
}

/**
 * Convert a texture path into a URL that uses the custom `texture://` protocol
 * so the renderer can load the image without exposing file paths.
 */
export async function getTextureURL(
  projectPath: string,
  texture: string
): Promise<string> {
  // Record paths used by the protocol so it can resolve this texture later
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const cacheRoot = await ensureAssets(meta.version);
  cacheTexturesDir = path.join(cacheRoot, 'assets', 'minecraft', 'textures');
  projectTexturesDir = path.join(
    projectPath,
    'assets',
    'minecraft',
    'textures'
  );
  return `texture://${texture}`;
}

/**
 * Register the `texture` protocol so it serves files directly from disk.
 */
export function registerTextureProtocol(protocol: Protocol) {
  protocol.registerFileProtocol('texture', (request, callback) => {
    const rel = decodeURI(request.url.replace('texture://', ''));
    const projectFile = projectTexturesDir
      ? path.join(projectTexturesDir, rel)
      : '';
    if (projectFile && fs.existsSync(projectFile)) {
      callback(projectFile);
      return;
    }
    const cacheFile = cacheTexturesDir ? path.join(cacheTexturesDir, rel) : '';
    callback(cacheFile);
  });
}

/** Update the directories used by the texture protocol for the active project. */
export async function setActiveProject(projectPath: string): Promise<void> {
  const metaPath = path.join(projectPath, 'project.json');
  const data = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const meta = ProjectMetadataSchema.parse(data);
  const cacheRoot = await ensureAssets(meta.version);
  cacheTexturesDir = path.join(cacheRoot, 'assets', 'minecraft', 'textures');
  projectTexturesDir = path.join(
    projectPath,
    'assets',
    'minecraft',
    'textures'
  );
}
