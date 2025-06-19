import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { setActiveProject } from '../src/main/assets/protocols';
import * as cache from '../src/main/assets/cache';

const baseDir = path.join(os.tmpdir(), `active-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

describe('setActiveProject', () => {
  it('returns false for malformed project.json', async () => {
    const proj = path.join(baseDir, 'bad');
    fs.mkdirSync(proj, { recursive: true });
    fs.writeFileSync(path.join(proj, 'project.json'), '{ bad');
    const ensure = vi.spyOn(cache, 'ensureAssets').mockResolvedValue('');
    const ok = await setActiveProject(proj);
    expect(ok).toBe(false);
    expect(ensure).not.toHaveBeenCalled();
  });
});
