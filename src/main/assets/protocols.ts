/**
 * Custom file protocols used by the renderer to load assets.
 *
 * `vanilla://` serves cached vanilla textures, while `asset://` resolves files
 * from the currently active project directory.
 */
/* c8 ignore start */
import path from 'path';
import type { Protocol } from 'electron';

import { readProjectMetaSafe } from '../projectMeta';
import { ensureAssets } from './cache';

let cacheTexturesDir = '';
let activeProjectDir = '';

/** Update cached texture directory used by the `vanilla` protocol. */
export function setCacheTexturesDir(dir: string): void {
  cacheTexturesDir = dir;
}

/**
 * Register a file protocol that maps `vanilla://` URLs to cached vanilla
 * texture files on disk.
 */
export function registerVanillaProtocol(protocol: Protocol): void {
  protocol.registerFileProtocol('vanilla', (request, callback) => {
    const rel = decodeURI(request.url.replace('vanilla://', ''));
    const file = cacheTexturesDir ? path.join(cacheTexturesDir, rel) : '';
    callback(file);
  });
}

/**
 * Register a file protocol that resolves `asset://` URLs relative to the
 * currently active project directory.
 */
export function registerAssetProtocol(protocol: Protocol): void {
  protocol.registerFileProtocol('asset', (request, callback) => {
    const rel = decodeURI(request.url.replace('asset://', ''));
    let file = activeProjectDir ? path.join(activeProjectDir, rel) : '';
    if (/(\\|\/)$/.test(file)) file = file.slice(0, -1);
    if (file.includes('?t=')) file = file.substring(0, file.indexOf('?t='));
    callback(file);
  });
}

/**
 * Point the custom protocols at a new project and ensure vanilla assets are
 * cached for that project's Minecraft version.
 */
export async function setActiveProject(projectPath: string): Promise<boolean> {
  const meta = await readProjectMetaSafe(projectPath);
  if (!meta) return false;
  try {
    const cacheRoot = await ensureAssets(meta.minecraft_version);
    setCacheTexturesDir(
      path.join(cacheRoot, 'assets', 'minecraft', 'textures')
    );
    activeProjectDir = projectPath;
    return true;
  } catch {
    return false;
  }
}
/* c8 ignore end */
