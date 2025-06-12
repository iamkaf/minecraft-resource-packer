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
    expect(entry).toBeDefined();
    const buf = await entry!.buffer();
    const data = JSON.parse(buf.toString('utf-8'));
    expect(data.pack.pack_format).toBe(15);
  });
});
