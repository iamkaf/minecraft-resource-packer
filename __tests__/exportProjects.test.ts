import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import unzipper from 'unzipper';
// eslint-disable-next-line no-var
var showOpenDialogMock: ReturnType<typeof vi.fn>;

vi.mock('electron', () => {
  showOpenDialogMock = vi.fn();
  return { dialog: { showOpenDialog: showOpenDialogMock } };
});

import { exportProjects } from '../src/main/exporter';

const tmpDir = path.join(os.tmpdir(), `bulk-${uuid()}`);
const baseDir = path.join(tmpDir, 'projects');
const projA = path.join(baseDir, 'A');
const projB = path.join(baseDir, 'B');
const outDir = path.join(tmpDir, 'out');

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
    const dirA = await unzipper.Open.file(path.join(outDir, 'A.zip'));
    const namesA = dirA.files.map((f) => f.path);
    expect(namesA).toContain('a.txt');
    const dirB = await unzipper.Open.file(path.join(outDir, 'B.zip'));
    const namesB = dirB.files.map((f) => f.path);
    expect(namesB).toContain('b.txt');
  });
});
