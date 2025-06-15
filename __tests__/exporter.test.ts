import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { exportPack } from '../src/main/exporter';
import unzipper from 'unzipper';
import os from 'os';
import { v4 as uuid } from 'uuid';

const tmpDir = path.join(os.tmpdir(), `packtest-${uuid()}`);
const projectDir = path.join(tmpDir, 'project');
const outZip = path.join(tmpDir, 'pack.zip');

beforeAll(() => {
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'file.txt'), 'data');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('exportPack', () => {
  it('creates zip with pack.mcmeta', async () => {
    await exportPack(projectDir, outZip);
    const dir = await unzipper.Open.file(outZip);
    const names = dir.files.map((f) => f.path);
    expect(names).toContain('file.txt');
    expect(names).toContain('pack.mcmeta');
  });

  it('writes correct pack_format for version', async () => {
    await exportPack(projectDir, outZip, '1.20.1');
    const dir = await unzipper.Open.file(outZip);
    const entry = dir.files.find((f) => f.path === 'pack.mcmeta');
    if (!entry) throw new Error('pack.mcmeta not found');
    const buf = await entry.buffer();
    const data = JSON.parse(buf.toString('utf-8'));
    expect(data.pack.pack_format).toBe(15);
  });

  it('skips files listed in noExport', async () => {
    const meta = {
      name: 'proj',
      version: '1.21.1',
      assets: [],
      noExport: ['skip.txt'],
      description: '',
      license: '',
      authors: [],
      urls: [],
      created: 0,
    };
    fs.writeFileSync(path.join(projectDir, 'pack.json'), JSON.stringify(meta));
    fs.writeFileSync(path.join(projectDir, 'skip.txt'), 'x');
    fs.writeFileSync(path.join(projectDir, 'keep.txt'), 'y');
    await exportPack(projectDir, outZip);
    const dir = await unzipper.Open.file(outZip);
    const names = dir.files.map((f) => f.path);
    expect(names).toContain('keep.txt');
    expect(names).not.toContain('skip.txt');
  });

  it('does not include empty dirs for skipped files', async () => {
    const meta = {
      name: 'proj',
      version: '1.21.1',
      assets: [],
      noExport: ['folder/skip.txt'],
      description: '',
      license: '',
      authors: [],
      urls: [],
      created: 0,
    };
    fs.writeFileSync(path.join(projectDir, 'pack.json'), JSON.stringify(meta));
    const folder = path.join(projectDir, 'folder');
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'skip.txt'), 'x');
    await exportPack(projectDir, outZip);
    const dir = await unzipper.Open.file(outZip);
    const names = dir.files.map((f) => f.path);
    expect(names).not.toContain('folder/');
  });
});
