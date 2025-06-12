import { describe, it, expect, vi } from 'vitest';

// Capture the IPC handler registered by registerFileHandlers
// eslint-disable-next-line no-var
var openHandler: ((e: unknown, file: string) => void) | undefined;
// eslint-disable-next-line no-var
var openPathMock: ReturnType<typeof vi.fn>;

// Mock Electron modules used by index.ts
vi.mock('electron', () => ({
  app: {
    getPath: () => '/tmp',
    whenReady: () => Promise.resolve(),
    on: vi.fn(),
  },
  BrowserWindow: vi.fn(() => ({
    loadURL: vi.fn(),
    webContents: { on: vi.fn(), send: vi.fn() },
  })),
  ipcMain: {
    handle: (channel: string, fn: (event: unknown, file: string) => void) => {
      if (channel === 'open-file') openHandler = fn;
    },
  },
  shell: { openPath: (openPathMock = vi.fn()) },
}));

// Register only the file handlers so we can test them in isolation
import { registerFileHandlers } from '../src/main/ipcFiles';
registerFileHandlers();

describe('open-file IPC', () => {
  it('calls shell.openPath with the provided path', async () => {
    expect(openHandler).toBeTypeOf('function');
    await openHandler?.({}, '/tmp/foo.txt');
    expect(openPathMock).toHaveBeenCalledWith('/tmp/foo.txt');
  });
});
