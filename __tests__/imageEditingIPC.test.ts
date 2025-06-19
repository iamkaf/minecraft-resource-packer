import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { registerTextureLabHandlers } from '../src/main/textureLab';

vi.mock('../src/main/revision', () => ({
  saveRevisionForFile: vi.fn(async () => {}),
}));

let handler:
  | ((e: unknown, file: string, ops: unknown) => Promise<void>)
  | undefined;
const ipcMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'apply-image-edits') handler = fn as typeof handler;
  },
};

describe('apply-image-edits IPC', () => {
  it('applies rotation with sharp', async () => {
    const tmp = path.join(os.tmpdir(), 'edit-test.png');
    await sharp({
      create: { width: 2, height: 2, channels: 4, background: '#ff0000' },
    })
      .png()
      .toFile(tmp);
    registerTextureLabHandlers(
      ipcMock as unknown as import('electron').IpcMain
    );
    expect(handler).toBeTypeOf('function');
    await handler?.({}, tmp, [{ op: 'rotate', angle: 90 }]);
    const { saveRevisionForFile } = await import('../src/main/revision');
    expect(saveRevisionForFile).toHaveBeenCalledWith(tmp);
    const meta = await sharp(tmp).metadata();
    expect(meta.format).toBe('png');
    fs.unlinkSync(tmp);
  });
});
