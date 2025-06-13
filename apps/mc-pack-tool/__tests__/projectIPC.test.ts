import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/main/icon', () => ({
  generatePackIcon: vi.fn().mockResolvedValue(undefined),
}));
import * as projects from '../src/main/projects';

let createHandler:
  | ((e: unknown, name: string, version: string) => void | Promise<void>)
  | undefined;

const ipcMainMock: {
  handle: (channel: string, fn: (...a: unknown[]) => unknown) => void;
} = {
  handle: (channel: string, fn: (...a: unknown[]) => unknown) => {
    if (channel === 'create-project') createHandler = fn;
  },
};

describe('create-project IPC', () => {
  it('registers handler and executes without error', async () => {
    projects.registerProjectHandlers(ipcMainMock, '/tmp/base', vi.fn());
    expect(createHandler).toBeTypeOf('function');
    await expect(createHandler?.({}, 'Test', '1.21')).resolves.toBeUndefined();
  });
});
