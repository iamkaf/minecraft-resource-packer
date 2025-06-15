import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { registerAssetHandlers } from '../src/main/assets';
import type { IconOptions } from '../src/shared/icon';

let handler:
  | ((e: unknown, project: string, opts: IconOptions) => Promise<void>)
  | undefined;
const ipcMock: Partial<import('electron').IpcMain> = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'set-pack-icon') handler = fn as typeof handler;
  },
};

describe('set-pack-icon IPC', () => {
  it('writes 128x128 pack.png', async () => {
    registerAssetHandlers(ipcMock as import('electron').IpcMain);
    const dir = path.join(os.tmpdir(), 'icon-test');
    fs.mkdirSync(dir, { recursive: true });
    const buf = await sharp({
      create: { width: 10, height: 10, channels: 4, background: '#f00' },
    })
      .png()
      .toBuffer();
    await handler?.({}, dir, {
      data: buf.toString('base64'),
      borderColor: '#fff',
    });
    const meta = await sharp(path.join(dir, 'pack.png')).metadata();
    expect(meta.width).toBe(128);
    expect(meta.height).toBe(128);
  });
});
