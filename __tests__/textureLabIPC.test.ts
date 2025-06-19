import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { registerTextureLabHandlers } from '../src/main/textureLab';

vi.mock('../src/main/revision', () => ({
  saveRevisionForFile: vi.fn(async () => {}),
}));

let editHandler:
  | ((e: unknown, file: string, opts: unknown) => Promise<void>)
  | undefined;
let undoHandler: ((e: unknown, file: string) => Promise<void>) | undefined;
let redoHandler: ((e: unknown, file: string) => Promise<void>) | undefined;
const ipcMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'edit-texture') editHandler = fn as typeof editHandler;
    if (channel === 'undo-texture') undoHandler = fn as typeof undoHandler;
    if (channel === 'redo-texture') redoHandler = fn as typeof redoHandler;
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
    expect(editHandler).toBeTypeOf('function');
    await editHandler?.({}, tmp, { grayscale: true, flip: 'horizontal' });
    await undoHandler?.({}, tmp);
    await redoHandler?.({}, tmp);
    const { saveRevisionForFile } = await import('../src/main/revision');
    expect(saveRevisionForFile).toHaveBeenCalledWith(tmp);
    const meta = await sharp(tmp).metadata();
    expect(meta.format).toBe('png');
    fs.unlinkSync(tmp);
  });
});
