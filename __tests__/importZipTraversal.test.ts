import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import archiver from 'archiver';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line no-var
var showOpenDialogMock: ReturnType<typeof vi.fn>;

vi.mock('electron', () => {
  showOpenDialogMock = vi.fn();
  return {
    dialog: { showOpenDialog: showOpenDialogMock },
    app: { getPath: () => os.tmpdir() },
  };
});

import { importProject } from '../src/main/projects';

const tmpDir = path.join(os.tmpdir(), `import-${uuid()}`);
const baseDir = path.join(tmpDir, 'projects');
const zipPath = path.join(tmpDir, 'pack.zip');

beforeAll(async () => {
  fs.mkdirSync(baseDir, { recursive: true });
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.append('safe', { name: 'good.txt' });
    archive.append('bad', { name: '../evil/steal.txt' });
    archive.finalize();
  });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('importProject path traversal', () => {
  it('ignores paths outside the destination', async () => {
    showOpenDialogMock.mockResolvedValue({
      canceled: false,
      filePaths: [zipPath],
    });
    await importProject(baseDir);
    expect(fs.existsSync(path.join(baseDir, 'pack', 'good.txt'))).toBe(true);
    expect(fs.existsSync(path.join(baseDir, 'evil', 'steal.txt'))).toBe(false);
  });
});
