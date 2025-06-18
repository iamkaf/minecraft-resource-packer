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
    app: { getPath: () => '/tmp' },
  };
});

import { importProject } from '../src/main/projects';
import { ProjectMetadataSchema } from '../src/shared/project';

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
    archive.append(
      JSON.stringify({ pack: { pack_format: 15, description: '' } }),
      { name: 'pack.mcmeta' }
    );
    archive.append('data', { name: 'foo.txt' });
    archive.finalize();
  });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('importProject (zip)', () => {
  it('sets minecraft version from pack.mcmeta', async () => {
    showOpenDialogMock.mockResolvedValue({
      canceled: false,
      filePaths: [zipPath],
    });
    const summary = await importProject(baseDir);
    const dest = path.join(baseDir, 'pack');
    const data = JSON.parse(
      fs.readFileSync(path.join(dest, 'project.json'), 'utf-8')
    );
    const meta = ProjectMetadataSchema.parse(data);
    expect(meta.minecraft_version).toBe('1.20.1');
    expect(fs.existsSync(path.join(dest, 'foo.txt'))).toBe(true);
    expect(summary?.name).toBe('pack');
    expect(summary?.fileCount).toBeGreaterThan(0);
  });
});
