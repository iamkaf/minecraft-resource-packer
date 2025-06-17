import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';

// eslint-disable-next-line no-var
var watchHandler: ((e: unknown, p: string) => Promise<string[]>) | undefined;
// eslint-disable-next-line no-var
var unwatchHandler: ((e: unknown, p: string) => Promise<void>) | undefined;
// eslint-disable-next-line no-var
var sendMock: ReturnType<typeof vi.fn>;
// eslint-disable-next-line no-var
var watchMock: ReturnType<typeof vi.fn>;

class FakeWatcher extends EventEmitter {
  close = vi.fn(async () => {});
}

vi.mock('electron', () => {
  sendMock = vi.fn();
  return {
    BrowserWindow: vi.fn(() => ({ webContents: { send: sendMock } })),
    ipcMain: {
      handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
        if (channel === 'watch-project')
          watchHandler = fn as typeof watchHandler;
        if (channel === 'unwatch-project')
          unwatchHandler = fn as typeof unwatchHandler;
      },
    },
  };
});

vi.mock('chokidar', () => {
  watchMock = vi.fn(() => new FakeWatcher());
  return { watch: watchMock };
});

import {
  registerFileWatcherHandlers,
  emitRenamed,
} from '../src/main/ipc/fileWatcher';

const tmpDir = path.join(os.tmpdir(), 'fw-test');

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, 'a.txt'), 'a');
  fs.writeFileSync(path.join(tmpDir, 'b.txt'), 'b');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('fileWatcher IPC', () => {
  it('relays chokidar events to renderer', async () => {
    const { BrowserWindow, ipcMain } = await import('electron');
    const win = new BrowserWindow();
    registerFileWatcherHandlers(
      ipcMain as unknown as import('electron').IpcMain,
      win as unknown as import('electron').BrowserWindow
    );

    const list = await watchHandler?.({}, tmpDir);
    expect(list?.sort()).toEqual(['a.txt', 'b.txt']);
    expect(watchMock).toHaveBeenCalledWith(tmpDir, { ignoreInitial: true });

    const watcher = watchMock.mock.results[0].value as FakeWatcher;
    watcher.emit('add', path.join(tmpDir, 'c.txt'));
    expect(sendMock).toHaveBeenCalledWith('file-added', 'c.txt');

    watcher.emit('unlink', path.join(tmpDir, 'b.txt'));
    expect(sendMock).toHaveBeenCalledWith('file-removed', 'b.txt');

    watcher.emit('change', path.join(tmpDir, 'c.txt'));
    const call = sendMock.mock.calls.find((c) => c[0] === 'file-changed');
    expect(call?.[1]).toMatchObject({ path: 'c.txt' });
    expect(typeof call?.[1].stamp).toBe('number');

    emitRenamed(path.join(tmpDir, 'a.txt'), path.join(tmpDir, 'd.txt'));
    expect(sendMock).toHaveBeenCalledWith('file-renamed', {
      oldPath: 'a.txt',
      newPath: 'd.txt',
    });

    await unwatchHandler?.({}, tmpDir);
    expect(watcher.close).toHaveBeenCalled();
  });
});
