import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { createProject } from '../src/main/projects';
import { addTexture } from '../src/main/assets';

const tmpDir = path.join(os.tmpdir(), `texturetest-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('addTexture', () => {
  it('copies texture into project folder', async () => {
    createProject(tmpDir, 'Pack', '1.21.1');
    const proj = path.join(tmpDir, 'Pack');
    // pre-create cached texture to avoid network fetch
    const cacheTex = path.join(
      os.tmpdir(),
      'assets-cache',
      '1.21.1',
      'client',
      'assets',
      'minecraft',
      'textures',
      'block'
    );
    fs.mkdirSync(cacheTex, { recursive: true });
    const srcFile = path.join(cacheTex, 'stone.png');
    fs.writeFileSync(srcFile, 'data');
    await addTexture(proj, 'block/stone.png');
    const dest = path.join(
      proj,
      'assets',
      'minecraft',
      'textures',
      'block',
      'stone.png'
    );
    expect(fs.existsSync(dest)).toBe(true);
  });
});
