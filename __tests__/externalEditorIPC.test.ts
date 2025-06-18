import { describe, it, expect, vi } from 'vitest';

// Capture the IPC handler registered by registerExternalEditorHandlers
// eslint-disable-next-line no-var
var handler: ((e: unknown, file: string) => void | Promise<void>) | undefined;
// eslint-disable-next-line no-var
var spawnMock: ReturnType<typeof vi.fn>;

vi.mock('child_process', () => {
  spawnMock = vi.fn(() => ({ unref: vi.fn() }));
  return { spawn: spawnMock, default: { spawn: spawnMock } };
});

vi.mock('../src/main/revision', () => ({
  saveRevisionForFile: vi.fn(async () => {}),
}));

vi.mock('../src/main/layout', () => ({
  getTextureEditor: () => '/usr/bin/gimp',
}));

const ipcMainMock = {
  handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
    if (channel === 'open-external-editor') handler = fn as typeof handler;
  },
};

import { registerExternalEditorHandlers } from '../src/main/externalEditor';
registerExternalEditorHandlers(
  ipcMainMock as unknown as import('electron').IpcMain
);

describe('open-external-editor IPC', () => {
  it('spawns configured editor with file path', async () => {
    expect(handler).toBeTypeOf('function');
    await handler?.({}, '/tmp/a.png');
    const { saveRevisionForFile } = await import('../src/main/revision');
    expect(saveRevisionForFile).toHaveBeenCalledWith('/tmp/a.png');
    expect(spawnMock).toHaveBeenCalledWith('/usr/bin/gimp', ['/tmp/a.png'], {
      detached: true,
      stdio: 'ignore',
    });
  });
});
