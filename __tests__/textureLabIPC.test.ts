import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { registerTextureLabHandlers } from '../src/main/textureLab';

let handler:
  | ((e: unknown, file: string, opts: unknown) => Promise<void>)
  | undefined;
const ipcMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'edit-texture') handler = fn as typeof handler;
  },
};

describe('edit-texture IPC', () => {
  it('modifies the file using sharp', async () => {
    const tmp = path.join(os.tmpdir(), 'lab-test.png');
    await sharp({
      create: { width: 2, height: 2, channels: 4, background: '#ff0000' },
    })
      .png()
      .toFile(tmp);
    registerTextureLabHandlers(
      ipcMock as unknown as import('electron').IpcMain
    );
    expect(handler).toBeTypeOf('function');
    await handler?.({}, tmp, { grayscale: true });
    const meta = await sharp(tmp).metadata();
    expect(meta.format).toBe('png');
    fs.unlinkSync(tmp);
  });
});
