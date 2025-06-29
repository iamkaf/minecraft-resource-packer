import { describe, it, expect, vi } from 'vitest';
import os from 'os';
import path from 'path';

// Capture the IPC handler registered by registerFileHandlers
// eslint-disable-next-line no-var
var openHandler:
  | ((e: unknown, file: string) => Promise<void> | void)
  | undefined;
// eslint-disable-next-line no-var
var openPathMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => {
  openPathMock = vi.fn();
  return {
    app: {
      getPath: () => os.tmpdir(),
      whenReady: () => Promise.resolve(),
      on: vi.fn(),
    },
    BrowserWindow: vi.fn(() => ({
      loadURL: vi.fn(),
      webContents: { on: vi.fn(), send: vi.fn() },
    })),
    shell: { openPath: openPathMock },
  };
});

const ipcMainMock: {
  handle: (channel: string, fn: (...a: unknown[]) => unknown) => void;
} = {
  handle: (channel, fn) => {
    if (channel === 'open-file') openHandler = fn;
  },
};

// Register only the file handlers so we can test them in isolation
import { registerFileHandlers } from '../src/main/ipcFiles';
registerFileHandlers(ipcMainMock as unknown as import('electron').IpcMain);

describe('open-file IPC', () => {
  it('calls shell.openPath with the provided path', async () => {
    expect(openHandler).toBeTypeOf('function');
    const file = path.join(os.tmpdir(), 'foo.txt');
    await openHandler?.({}, file);
    expect(openPathMock).toHaveBeenCalledWith(file);
  });
});
