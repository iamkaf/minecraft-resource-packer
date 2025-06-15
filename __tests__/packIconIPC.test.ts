import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { registerIconHandlers } from '../src/main/icon';

let handler:
  | ((
      e: unknown,
      project: string,
      file: string,
      border: string
    ) => Promise<void>)
  | undefined;
const ipcMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'save-pack-icon') handler = fn as typeof handler;
  },
};

describe('save-pack-icon IPC', () => {
  it('writes 128x128 png', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'icon-test-'));
    const img = path.join(tmp, 'in.png');
    await sharp({
      create: { width: 16, height: 16, channels: 4, background: '#f00' },
    })
      .png()
      .toFile(img);
    const proj = path.join(tmp, 'proj');
    fs.mkdirSync(proj);
    registerIconHandlers(ipcMock as unknown as import('electron').IpcMain);
    expect(handler).toBeTypeOf('function');
    await handler?.({}, proj, img, '#00ff00');
    const meta = await sharp(path.join(proj, 'pack.png')).metadata();
    expect(meta.width).toBe(128);
    expect(meta.height).toBe(128);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
