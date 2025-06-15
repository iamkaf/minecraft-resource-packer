import type { IpcMain, BrowserWindow } from 'electron';
import sharp from 'sharp';

export interface TextureOps {
  hue?: number;
  rotate?: number;
  grayscale?: boolean;
  saturation?: number;
  brightness?: number;
}

export async function applyTextureOps(
  file: string,
  ops: TextureOps,
  onProgress?: (pct: number) => void
): Promise<void> {
  let img = sharp(file);
  const steps =
    (ops.hue ? 1 : 0) +
    (ops.rotate ? 1 : 0) +
    (ops.grayscale ? 1 : 0) +
    (ops.saturation ? 1 : 0) +
    (ops.brightness ? 1 : 0);
  let done = 0;
  const step = () => {
    done++;
    onProgress?.(Math.round((done / steps) * 100));
  };
  if (
    ops.hue !== undefined ||
    ops.saturation !== undefined ||
    ops.brightness !== undefined
  ) {
    img = img.modulate({
      hue: ops.hue ?? 0,
      saturation: ops.saturation ? 1 + ops.saturation / 100 : undefined,
      brightness: ops.brightness ? 1 + ops.brightness / 100 : undefined,
    });
    step();
  }
  if (ops.rotate) {
    img = img.rotate(ops.rotate);
    step();
  }
  if (ops.grayscale) {
    img = img.grayscale();
    step();
  }
  const buf = await img.toBuffer();
  await sharp(buf).toFile(file);
  if (steps === 0) onProgress?.(100);
}

export function registerTextureLabHandlers(ipc: IpcMain, win: BrowserWindow) {
  ipc.handle(
    'apply-texture-ops',
    async (_e, file: string, ops: TextureOps): Promise<void> => {
      await applyTextureOps(file, ops, (p) => {
        win.webContents.send('texture-progress', p);
      });
    }
  );
}
