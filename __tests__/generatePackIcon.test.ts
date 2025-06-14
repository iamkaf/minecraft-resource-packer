import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { createProject } from '../src/main/projects';
import { generatePackIcon } from '../src/main/icon';

const tmpDir = path.join(os.tmpdir(), `icon-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('generatePackIcon', () => {
  it('creates 128x128 pack.png', async () => {
    const texRoot = path.join(
      os.tmpdir(),
      'assets-cache',
      '1.21.1',
      'client',
      'assets',
      'minecraft',
      'textures'
    );
    const cacheDir = path.join(texRoot, 'item');
    fs.mkdirSync(cacheDir, { recursive: true });
    const texPath = path.join(cacheDir, 'stone.png');
    const data = await sharp({
      create: { width: 16, height: 16, channels: 4, background: '#f00' },
    })
      .png()
      .toBuffer();
    fs.writeFileSync(texPath, data);

    await createProject(tmpDir, 'Pack', '1.21.1');
    const proj = path.join(tmpDir, 'Pack');

    await generatePackIcon(proj);
    const iconFile = path.join(proj, 'pack.png');
    expect(fs.existsSync(iconFile)).toBe(true);
    const meta = await sharp(iconFile).metadata();
    expect(meta.width).toBe(128);
    expect(meta.height).toBe(128);
  });
});
