import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import * as cache from '../src/main/assets/cache';
let setActiveProject: typeof import('../src/main/assets/protocols').setActiveProject;
const errorMock = vi.fn();
vi.mock('../src/main/logger', () => ({
  default: { error: errorMock, info: vi.fn() },
}));

const baseDir = path.join(os.tmpdir(), `active-${uuid()}`);

beforeAll(async () => {
  fs.mkdirSync(baseDir, { recursive: true });
  ({ setActiveProject } = await import('../src/main/assets/protocols'));
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
    expect(errorMock).toHaveBeenCalledWith(expect.stringContaining(proj));
  });
});
