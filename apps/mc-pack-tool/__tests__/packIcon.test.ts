import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { generatePackIcon } from '../src/main/icon';
import sharp from 'sharp';

const tmpDir = path.join(os.tmpdir(), 'icon-test');

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('generatePackIcon', () => {
  it('creates deterministic 128x128 png', async () => {
    const out1 = path.join(tmpDir, 'a.png');
    const out2 = path.join(tmpDir, 'b.png');
    await generatePackIcon(1234, out1);
    await generatePackIcon(1234, out2);
    const meta = await sharp(out1).metadata();
    expect(meta.width).toBe(128);
    expect(meta.height).toBe(128);
    const buf1 = fs.readFileSync(out1);
    const buf2 = fs.readFileSync(out2);
    expect(buf1.equals(buf2)).toBe(true);
  });
});
