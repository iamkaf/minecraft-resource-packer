import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { editTexture } from '../src/main/textureLab';
import { listRevisions } from '../src/main/revision';
vi.mock('../src/main/layout', () => ({ getTextureEditor: () => '/bin/true' }));
vi.mock('child_process', () => {
  const spawn = vi.fn(() => ({ unref: vi.fn() }));
  return { spawn, default: { spawn } };
});

function makeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'revtest-'));
  fs.writeFileSync(path.join(dir, 'project.json'), '{}');
  return dir;
}

describe('automatic revision history', () => {
  it('saves revision when texture lab edits', async () => {
    const proj = makeProject();
    const file = path.join(proj, 'a.png');
    await sharp({
      create: { width: 2, height: 2, channels: 4, background: '#f00' },
    })
      .png()
      .toFile(file);
    await editTexture(file, { grayscale: true });
    const revs = await listRevisions(proj, 'a.png');
    expect(revs.length).toBe(1);
    fs.rmSync(proj, { recursive: true, force: true });
  });

  it('saves revision before external edit', async () => {
    const proj = makeProject();
    const file = path.join(proj, 'b.png');
    fs.writeFileSync(file, 'data');
    const { openWithEditor } = await import('../src/main/externalEditor');
    await openWithEditor(file);
    fs.writeFileSync(file, 'new');
    await new Promise((r) => setTimeout(r, 10));
    const revs = await listRevisions(proj, 'b.png');
    expect(revs.length).toBe(1);
    fs.rmSync(proj, { recursive: true, force: true });
  });
});
