import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
var sendMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => {
  const send = vi.fn();
  sendMock = send;
  return {
    BrowserWindow: {
      getAllWindows: () => [{ webContents: { send } }],
    },
    app: { getPath: () => '/tmp', whenReady: () => Promise.resolve(), on: vi.fn() },
  };
});
vi.mock('../src/main/icon', () => ({
  generatePackIcon: vi.fn().mockResolvedValue(undefined),
}));
import * as projects from '../src/main/projects';

let createHandler:
  | ((e: unknown, name: string, version: string) => void | Promise<void>)
  | undefined;
let openHandler:
  | ((e: unknown, name: string) => Promise<void> | void)
  | undefined;
let loadHandler: ((e: unknown, name: string) => Promise<unknown>) | undefined;

const ipcMainMock: {
  handle: (channel: string, fn: (...a: unknown[]) => unknown) => void;
} = {
  handle: (channel: string, fn: (...a: unknown[]) => unknown) => {
    if (channel === 'create-project') createHandler = fn;
    if (channel === 'open-project') openHandler = fn as typeof openHandler;
    if (channel === 'load-pack-meta') loadHandler = fn as typeof loadHandler;
  },
};

const baseDir = path.join(os.tmpdir(), `proj-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

describe('create-project IPC', () => {
  it('registers handler and executes without error', async () => {
    projects.registerProjectHandlers(ipcMainMock, baseDir, vi.fn());
    expect(createHandler).toBeTypeOf('function');
    await expect(createHandler?.({}, 'Test', '1.21')).resolves.toBeUndefined();
  });
});

describe('open-project IPC', () => {
  it('emits pack-meta-missing when metadata absent', async () => {
    projects.registerProjectHandlers(ipcMainMock, baseDir, vi.fn());
    await openHandler?.({}, 'Missing').catch(() => {});
    expect(sendMock).toHaveBeenCalledWith(
      'pack-meta-missing',
      path.join(baseDir, 'Missing')
    );
    sendMock.mockClear();
    await loadHandler?.({}, 'Missing');
    expect(sendMock).toHaveBeenCalledWith(
      'pack-meta-missing',
      path.join(baseDir, 'Missing')
    );
  });
});
