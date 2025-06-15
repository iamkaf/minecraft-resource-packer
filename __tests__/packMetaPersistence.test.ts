import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { savePackMeta, loadPackMeta } from '../src/main/projects';
import { PackMetaSchema } from '../src/shared/project';

const baseDir = path.join(os.tmpdir(), `meta-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

describe('pack meta persistence', () => {
  it('writes and reads pack.json', async () => {
    fs.mkdirSync(path.join(baseDir, 'Pack'));
    const meta = {
      description: 'd',
      license: 'MIT',
      authors: ['a'],
      urls: [],
      created: 1,
    };
    await savePackMeta(baseDir, 'Pack', meta);
    const loaded = await loadPackMeta(baseDir, 'Pack');
    const parsed = PackMetaSchema.parse(loaded);
    expect(parsed).toEqual(meta);
  });

  it('returns defaults when missing', async () => {
    const loaded = await loadPackMeta(baseDir, 'Missing');
    expect(loaded.license).toBe('');
    expect(loaded.authors).toEqual([]);
  });
});
