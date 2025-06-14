import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import unzipper from 'unzipper';
import { exportProjects } from '../src/main/exporter';

const tmpDir = path.join(os.tmpdir(), `bulk-${uuid()}`);
const projA = path.join(tmpDir, 'A');
const projB = path.join(tmpDir, 'B');

beforeAll(() => {
  fs.mkdirSync(projA, { recursive: true });
  fs.mkdirSync(projB, { recursive: true });
  fs.writeFileSync(path.join(projA, 'a.txt'), '1');
  fs.writeFileSync(path.join(projB, 'b.txt'), '2');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('exportProjects', () => {
  it('exports multiple projects', async () => {
    await exportProjects([projA, projB]);
    const dirA = await unzipper.Open.file(path.join(projA, 'pack.zip'));
    const namesA = dirA.files.map((f) => f.path);
    expect(namesA).toContain('a.txt');
    const dirB = await unzipper.Open.file(path.join(projB, 'pack.zip'));
    const namesB = dirB.files.map((f) => f.path);
    expect(namesB).toContain('b.txt');
  });
});
