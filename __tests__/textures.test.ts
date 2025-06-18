import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';

import { createProject } from '../src/main/projects';
import { listTextures } from '../src/main/assets/textures';
import * as icon from '../src/main/icon';

describe('listTextures', () => {
  const baseDir = path.join(os.tmpdir(), `lt-${uuid()}`);
  const version = `lt-${uuid()}`;
  const projDir = path.join(baseDir, 'Pack');

  beforeAll(async () => {
    vi.spyOn(icon, 'generatePackIcon').mockResolvedValue();
    await createProject(baseDir, 'Pack', version);
    const texDir = path.join(
      os.tmpdir(),
      'assets-cache',
      version,
      'client',
      'assets',
      'minecraft',
      'textures',
      'block'
    );
    fs.mkdirSync(texDir, { recursive: true });
    fs.writeFileSync(path.join(texDir, 'foo.png'), 'data');
  });

  afterAll(() => fs.rmSync(baseDir, { recursive: true, force: true }));

  it('lists cached textures', async () => {
    const list = await listTextures(projDir);
    expect(list).toContain('block/foo.png');
  });

  it('uses forward slashes', async () => {
    const list = await listTextures(projDir);
    for (const item of list) {
      expect(item).not.toContain('\\');
    }
  });
});
