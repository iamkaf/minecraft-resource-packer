/**
 * IPC handlers and utilities related to project assets.
 */
import type { IpcMain } from 'electron';
import { generatePackIcon } from '../icon';
import {
  PACK_FORMATS,
  displayForFormat,
  PackFormatInfo,
} from '../../shared/packFormat';
import {
  addTexture,
  createTextureAtlas,
  getTexturePath,
  getTextureURL,
  listTextures,
} from './textures';

/** Return available pack format identifiers. */
export async function listPackFormats(): Promise<PackFormatInfo[]> {
  return PACK_FORMATS.map((r) => ({
    format: r.format,
    label: displayForFormat(r.format) as string,
  }));
}

/** Register IPC handlers related to asset management. */
export function registerAssetHandlers(ipc: IpcMain): void {
  ipc.handle('add-texture', (_e, projectPath: string, texture: string) =>
    addTexture(projectPath, texture)
  );
  ipc.handle('list-textures', (_e, projectPath: string) =>
    listTextures(projectPath)
  );
  ipc.handle('get-texture-path', (_e, projectPath: string, tex: string) =>
    getTexturePath(projectPath, tex)
  );
  ipc.handle('get-texture-url', (_e, projectPath: string, tex: string) =>
    getTextureURL(projectPath, tex)
  );
  ipc.handle('create-atlas', (_e, projectPath: string, tex: string[]) =>
    createTextureAtlas(projectPath, tex)
  );
  ipc.handle('randomize-icon', (_e, projectPath: string) =>
    generatePackIcon(projectPath)
  );
}
