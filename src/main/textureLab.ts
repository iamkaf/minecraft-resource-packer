import sharp from 'sharp';
import type { IpcMain } from 'electron';
import type { TextureEditOptions } from '../shared/texture';
import { saveRevisionForFile } from './revision';

export async function editTexture(
  file: string,
  opts: TextureEditOptions
): Promise<void> {
  await saveRevisionForFile(file);
  let img = sharp(file);
  if (opts.rotate) img = img.rotate(opts.rotate);

  const modulate: { hue?: number; saturation?: number; brightness?: number } =
    {};
  if (typeof opts.hue === 'number') modulate.hue = opts.hue;
  if (typeof opts.saturation === 'number')
    modulate.saturation = opts.saturation;
  if (typeof opts.brightness === 'number')
    modulate.brightness = opts.brightness;
  if (Object.keys(modulate).length) img = img.modulate(modulate);
  if (opts.grayscale) img = img.grayscale();
  const buf = await img.png().toBuffer();
  await sharp(buf).toFile(file);
}

export function registerTextureLabHandlers(ipc: IpcMain) {
  ipc.handle('edit-texture', (_e, file: string, opts: TextureEditOptions) => {
    return editTexture(file, opts);
  });
}
