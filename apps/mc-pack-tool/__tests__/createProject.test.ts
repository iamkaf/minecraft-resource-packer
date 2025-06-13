import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import { createProject } from '../src/main/projects';
import { ProjectMetadataSchema } from '../src/minecraft/project';

const baseDir = path.join(os.tmpdir(), `projtest-${uuid()}`);

beforeAll(() => {
  fs.mkdirSync(baseDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

describe('createProject', () => {
  it('writes valid project.json and icon seed', async () => {
    await createProject(baseDir, 'Test', '1.20');
    const data = JSON.parse(
      fs.readFileSync(path.join(baseDir, 'Test', 'project.json'), 'utf-8')
    );
    const meta = ProjectMetadataSchema.parse(data);
    expect(meta.name).toBe('Test');
    expect(meta.version).toBe('1.20');
    expect(fs.existsSync(path.join(baseDir, 'Test', 'pack.png'))).toBe(true);
    const settings = JSON.parse(
      fs.readFileSync(path.join(baseDir, 'Test', 'settings.json'), 'utf-8')
    );
    expect(typeof settings.iconSeed).toBe('number');
  });
});
