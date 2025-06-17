import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line no-var
var showOpenDialogMock: ReturnType<typeof vi.fn>;
// eslint-disable-next-line no-var
var showSaveDialogMock: ReturnType<typeof vi.fn>;

vi.mock('electron', () => {
  showOpenDialogMock = vi.fn();
  showSaveDialogMock = vi.fn();
  return {
    dialog: {
      showOpenDialog: showOpenDialogMock,
      showSaveDialog: showSaveDialogMock,
    },
    app: { getPath: () => '/tmp' },
  };
});

const tmpDir = path.join(os.tmpdir(), `exp-${uuid()}`);
const baseDir = path.join(tmpDir, 'projects');
const proj = path.join(baseDir, 'A');
const outDir = path.join(tmpDir, 'out');

beforeAll(() => {
  fs.mkdirSync(proj, { recursive: true });
  fs.writeFileSync(path.join(proj, 'a.txt'), '1');
  fs.mkdirSync(outDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('export directory persistence', () => {
  it('stores folder after bulk export', async () => {
    const { exportProjects } = await import('../src/main/exporter');
    showOpenDialogMock.mockResolvedValue({
      canceled: false,
      filePaths: [outDir],
    });
    await exportProjects(baseDir, ['A']);
    vi.resetModules();
    const { getDefaultExportDir } = await import('../src/main/layout');
    expect(getDefaultExportDir()).toBe(outDir);
  });

  it('stores folder after single export', async () => {
    let handler: ((e: unknown, p: string) => unknown) | undefined;
    const ipcMock = {
      handle: (channel: string, fn: (...args: unknown[]) => unknown) => {
        if (channel === 'export-project') handler = fn as typeof handler;
      },
    } as unknown as import('electron').IpcMain;
    const { registerExportHandlers } = await import('../src/main/exporter');
    registerExportHandlers(ipcMock, baseDir);
    showSaveDialogMock.mockResolvedValue({
      canceled: false,
      filePath: path.join(outDir, 'A.zip'),
    });
    expect(handler).toBeTypeOf('function');
    await handler?.({}, proj);
    vi.resetModules();
    const { getDefaultExportDir } = await import('../src/main/layout');
    expect(getDefaultExportDir()).toBe(outDir);
  });
});
