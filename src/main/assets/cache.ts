/**
 * Handles caching of vanilla Minecraft client assets on disk.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import unzipper from 'unzipper';
import { app as electronApp } from 'electron';
import { downloadFile, fetchJson, VERSION_MANIFEST } from './network';

/** Base directory used to store cached client JARs and extracted assets. */
const basePath = electronApp?.getPath
  ? electronApp.getPath('userData')
  : os.tmpdir();
/** Directory that contains one sub folder per Minecraft version. */
export const cacheDir = path.join(basePath, 'assets-cache');

/** Extract all files from a zip archive to the given directory. */
async function extractZip(src: string, dest: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(src)
      .pipe(unzipper.Extract({ path: dest }))
      .on('close', resolve)
      .on('error', reject);
  });
}

/** Ensure that assets for the given Minecraft version are available locally. */
export async function ensureAssets(version: string): Promise<string> {
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
