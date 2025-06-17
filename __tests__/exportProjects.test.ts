import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import unzipper from 'unzipper';
// eslint-disable-next-line no-var
var showOpenDialogMock: ReturnType<typeof vi.fn>;

const tmpDir = path.join(os.tmpdir(), `bulk-${uuid()}`);
const baseDir = path.join(tmpDir, 'projects');
const projA = path.join(baseDir, 'A');
const projB = path.join(baseDir, 'B');
const outDir = path.join(tmpDir, 'out');

vi.mock('electron', () => {
  showOpenDialogMock = vi.fn();
  return {
    dialog: { showOpenDialog: showOpenDialogMock },
    app: { getPath: () => '/tmp' },
  };
});

vi.mock('../src/main/layout', () => ({
  getDefaultExportDir: () => outDir,
  setDefaultExportDir: vi.fn(),
}));

import { exportProjects } from '../src/main/exporter';

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
  fs.mkdirSync(projA, { recursive: true });
  fs.mkdirSync(projB, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(projA, 'a.txt'), '1');
  fs.writeFileSync(path.join(projB, 'b.txt'), '2');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('exportProjects', () => {
  it('exports multiple projects', async () => {
    showOpenDialogMock.mockResolvedValue({
      canceled: false,
      filePaths: [outDir],
    });
    await exportProjects(baseDir, ['A', 'B']);
    const dirA = await unzipper.Open.file(path.join(outDir, 'A-vunknown.zip'));
    const namesA = dirA.files.map((f) => f.path);
    expect(namesA).toContain('a.txt');
    const dirB = await unzipper.Open.file(path.join(outDir, 'B-vunknown.zip'));
    const namesB = dirB.files.map((f) => f.path);
    expect(namesB).toContain('b.txt');
  });

  it('uses default directory for dialog', async () => {
    showOpenDialogMock.mockResolvedValue({ canceled: true, filePaths: [] });
    await exportProjects(baseDir, []);
    expect(showOpenDialogMock).toHaveBeenCalledWith(
      expect.objectContaining({ defaultPath: outDir })
    );
  });
});
