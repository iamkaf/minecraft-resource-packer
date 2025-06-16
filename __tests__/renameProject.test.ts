import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import {
  createProject,
  renameProject,
  registerProjectHandlers,
} from '../src/main/projects';
import * as icon from '../src/main/icon';

const baseDir = path.join(os.tmpdir(), `rename-${uuid()}`);

let handler:
  | ((e: unknown, name: string, newName: string) => void | Promise<void>)
  | undefined;
const ipcMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'rename-project') handler = fn as typeof handler;
  },
} as unknown as import('electron').IpcMain;

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
  vi.spyOn(icon, 'generatePackIcon').mockResolvedValue();
});

afterAll(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

describe('renameProject', () => {
  it('renames folder and updates metadata', async () => {
    await createProject(baseDir, 'Old', '1.20');
    await renameProject(baseDir, 'Old', 'New');
    expect(fs.existsSync(path.join(baseDir, 'New'))).toBe(true);
    expect(fs.existsSync(path.join(baseDir, 'Old'))).toBe(false);
    const data = JSON.parse(
      fs.readFileSync(path.join(baseDir, 'New', 'project.json'), 'utf-8')
    );
    expect(data.name).toBe('New');
  });

  it('registers IPC handler', async () => {
    registerProjectHandlers(ipcMock, baseDir, vi.fn());
    expect(handler).toBeTypeOf('function');
    await handler?.({}, 'New', 'Newer');
    expect(fs.existsSync(path.join(baseDir, 'Newer'))).toBe(true);
  });
});
