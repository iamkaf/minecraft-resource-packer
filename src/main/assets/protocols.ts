/**
 * Custom file protocols used by the renderer to load assets.
 */
import path from 'path';
import type { Protocol } from 'electron';

import { readProjectMeta } from '../projectMeta';
import { ensureAssets } from './cache';

let cacheTexturesDir = '';
let activeProjectDir = '';

/** Update cached texture directory used by vanilla protocol. */
export function setCacheTexturesDir(dir: string): void {
  cacheTexturesDir = dir;
}

/** Register the `vanilla` protocol so it serves files directly from disk. */
export function registerVanillaProtocol(protocol: Protocol): void {
  protocol.registerFileProtocol('vanilla', (request, callback) => {
    const rel = decodeURI(request.url.replace('vanilla://', ''));
    const file = cacheTexturesDir ? path.join(cacheTexturesDir, rel) : '';
    callback(file);
  });
}

/** Register the `asset` protocol to serve files from the active project. */
export function registerAssetProtocol(protocol: Protocol): void {
  protocol.registerFileProtocol('asset', (request, callback) => {
    const rel = decodeURI(request.url.replace('asset://', ''));
    let file = activeProjectDir ? path.join(activeProjectDir, rel) : '';
    if (/(\\|\/)$/.test(file)) file = file.slice(0, -1);
    if (file.includes('?t=')) file = file.substring(0, file.indexOf('?t='));
    callback(file);
  });
}

/** Update directories used by the custom protocols for the active project. */
export async function setActiveProject(projectPath: string): Promise<void> {
  const meta = await readProjectMeta(projectPath);
  const cacheRoot = await ensureAssets(meta.minecraft_version);
  setCacheTexturesDir(path.join(cacheRoot, 'assets', 'minecraft', 'textures'));
  activeProjectDir = projectPath;
}
