import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';

const errorMock = vi.fn();
vi.mock('../src/main/logger', () => ({
  default: { error: errorMock, info: vi.fn() },
}));

let readProjectMetaSafe: typeof import('../src/main/projectMeta').readProjectMetaSafe;
let writeProjectMeta: typeof import('../src/main/projectMeta').writeProjectMeta;

const tmpDir = path.join(os.tmpdir(), `meta-${uuid()}`);
const projDir = path.join(tmpDir, 'proj');

beforeAll(async () => {
  fs.mkdirSync(projDir, { recursive: true });
  ({ readProjectMetaSafe, writeProjectMeta } = await import(
    '../src/main/projectMeta'
  ));
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

  it('logs when metadata is invalid', async () => {
    fs.writeFileSync(path.join(projDir, 'project.json'), '{ bad');
    const meta = await readProjectMetaSafe(projDir);
    expect(meta).toBeUndefined();
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringContaining(path.join(projDir, 'project.json'))
    );
  });
});
