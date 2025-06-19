import fs from 'fs';
import sharp from 'sharp';
import type { IpcMain } from 'electron';
import type { TextureEditOptions } from '../shared/texture';
import { saveRevisionForFile } from './revision';

interface HistState {
  stack: Buffer[];
  index: number;
}

const history = new Map<string, HistState>();

export async function editTexture(
  file: string,
  opts: TextureEditOptions
): Promise<void> {
  const hist = history.get(file);
  let base: Buffer;
  if (!hist) {
    base = await fs.promises.readFile(file);
    history.set(file, { stack: [base], index: 0 });
  } else {
    base = hist.stack[hist.index];
    hist.stack = hist.stack.slice(0, hist.index + 1);
  }

  let img = sharp(base);
  if (opts.crop)
    img = img.extract({
      left: opts.crop.x,
      top: opts.crop.y,
      width: opts.crop.width,
      height: opts.crop.height,
    });
  if (opts.resize) img = img.resize(opts.resize.width, opts.resize.height);
  if (opts.flip === 'horizontal') img = img.flop();
  if (opts.flip === 'vertical') img = img.flip();
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
  if (opts.overlay) {
    const b64 = opts.overlay.split(',')[1];
    const buf = Buffer.from(b64, 'base64');
    img = img.composite([{ input: buf }]);
  }
  const out = await img.png().toBuffer();
  await saveRevisionForFile(file);
  await fs.promises.writeFile(file, out);
  const h = history.get(file)!;
  h.stack.push(out);
  if (h.stack.length > 20) {
    h.stack.shift();
  }
  h.index = h.stack.length - 1;
}

export async function undoTexture(file: string): Promise<void> {
  const hist = history.get(file);
  if (!hist || hist.index <= 0) return;
  hist.index -= 1;
  await fs.promises.writeFile(file, hist.stack[hist.index]);
}

export async function redoTexture(file: string): Promise<void> {
  const hist = history.get(file);
  if (!hist || hist.index >= hist.stack.length - 1) return;
  hist.index += 1;
  await fs.promises.writeFile(file, hist.stack[hist.index]);
}

export function registerTextureLabHandlers(ipc: IpcMain) {
  ipc.handle('edit-texture', (_e, file: string, opts: TextureEditOptions) => {
    return editTexture(file, opts);
  });
  ipc.handle('undo-texture', (_e, file: string) => {
    return undoTexture(file);
  });
  ipc.handle('redo-texture', (_e, file: string) => {
    return redoTexture(file);
  });
}
