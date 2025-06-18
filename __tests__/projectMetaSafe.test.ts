import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { readProjectMetaSafe, writeProjectMeta } from '../src/main/projectMeta';

const tmpDir = path.join(os.tmpdir(), `meta-${uuid()}`);
const projDir = path.join(tmpDir, 'proj');

beforeAll(() => {
  fs.mkdirSync(projDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('readProjectMetaSafe', () => {
  it('returns undefined when missing', async () => {
    const meta = await readProjectMetaSafe(projDir);
    expect(meta).toBeUndefined();
  });

  it('parses metadata when present', async () => {
    await writeProjectMeta(projDir, {
      name: 'Test',
      minecraft_version: '1.20',
      version: '0.0.0',
      assets: [],
      noExport: [],
    });
    const meta = await readProjectMetaSafe(projDir);
    expect(meta?.name).toBe('Test');
    expect(meta?.minecraft_version).toBe('1.20');
  });
});
