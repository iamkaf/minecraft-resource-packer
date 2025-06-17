import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { savePackMeta, loadPackMeta } from '../src/main/projects';

const tmpDir = path.join(os.tmpdir(), `ver-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('project version persistence', () => {
  it('saves and loads version from project.json', async () => {
    const proj = path.join(tmpDir, 'Pack');
    fs.mkdirSync(proj, { recursive: true });
    fs.writeFileSync(
      path.join(proj, 'project.json'),
      JSON.stringify({ name: 'Pack', version: '1.20.1', assets: [], noExport: [] })
    );
    await savePackMeta(tmpDir, 'Pack', {
      version: '1.21.1',
      description: '',
      author: '',
      urls: [],
      created: 0,
      license: '',
    });
    const meta = await loadPackMeta(tmpDir, 'Pack');
    expect(meta.version).toBe('1.21.1');
  });
});
