import sharp from 'sharp';
import type { IpcMain } from 'electron';
import type { TextureEditOptions, ImageEditOperation } from '../shared/texture';
import { ImageEditOperationSchema } from '../shared/texture';
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

export async function applyImageEdits(
  file: string,
  ops: ImageEditOperation[]
): Promise<void> {
  await saveRevisionForFile(file);
  let img = sharp(file);
  for (const op of ops) {
    const o = ImageEditOperationSchema.parse(op);
    switch (o.op) {
      case 'rotate':
        img = img.rotate(o.angle);
        break;
      case 'flipX':
        img = img.flop();
        break;
      case 'flipY':
        img = img.flip();
        break;
      case 'scale': {
        const meta = await img.metadata();
        if (meta.width && meta.height) {
          img = img.resize({
            width: Math.round(meta.width * o.factor),
            height: Math.round(meta.height * o.factor),
            kernel: 'nearest',
          });
        }
        break;
      }
      case 'crop':
        img = img.extract({
          left: Math.round(o.left),
          top: Math.round(o.top),
          width: Math.round(o.width),
          height: Math.round(o.height),
        });
        break;
      default:
        break;
    }
  }
  const buf = await img.png().toBuffer();
  await sharp(buf).toFile(file);
}

export function registerTextureLabHandlers(ipc: IpcMain) {
  ipc.handle('edit-texture', (_e, file: string, opts: TextureEditOptions) => {
    return editTexture(file, opts);
  });
  ipc.handle(
    'apply-image-edits',
    (_e, file: string, ops: ImageEditOperation[]) => {
      return applyImageEdits(file, ops);
    }
  );
}
