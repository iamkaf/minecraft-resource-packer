import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import type { TextureOps } from '../src/main/textureLab';

let applyHandler:
  | ((e: unknown, file: string, ops: TextureOps) => Promise<void>)
  | undefined;
let sendMock: ReturnType<typeof vi.fn>;

vi.mock('electron', () => {
  sendMock = vi.fn();
  return {
    BrowserWindow: vi.fn(() => ({ webContents: { send: sendMock } })),
    ipcMain: {
      handle: (channel: string, fn: (...args: unknown[]) => void) => {
        if (channel === 'apply-texture-ops')
          applyHandler = fn as typeof applyHandler;
      },
    },
  };
});

import { registerTextureLabHandlers } from '../src/main/textureLab';

const tmpDir = path.join(os.tmpdir(), `tl-${uuid()}`);
const imgPath = path.join(tmpDir, 'img.png');

beforeAll(async () => {
  fs.mkdirSync(tmpDir, { recursive: true });
  await sharp({
    create: { width: 16, height: 8, channels: 4, background: '#f00' },
  })
    .png()
    .toFile(imgPath);
});

afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

describe('apply-texture-ops IPC', () => {
  it('rotates image and sends progress', async () => {
    const { BrowserWindow, ipcMain } = await import('electron');
    const win = new BrowserWindow();
    registerTextureLabHandlers(
      ipcMain as unknown as import('electron').IpcMain,
      win as unknown as import('electron').BrowserWindow
    );

    await applyHandler?.({}, imgPath, { rotate: 90 });
    const meta = await sharp(imgPath).metadata();
    expect(meta.width).toBe(8);
    expect(meta.height).toBe(16);
    expect(sendMock).toHaveBeenCalledWith('texture-progress', 100);
  });
});
