import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const userDir = path.join(os.tmpdir(), 'logger-test');
vi.mock('electron', () => ({ app: { getPath: () => userDir } }));

describe('logger', () => {
  it('writes messages to file', async () => {
    fs.rmSync(userDir, { recursive: true, force: true });
    const { default: logger } = await import('../src/main/logger');
    logger.info('hello world');
    await new Promise((r) => setTimeout(r, 50));
    const data = fs.readFileSync(
      path.join(userDir, 'logs', 'app.log'),
      'utf-8'
    );
    expect(data).toMatch(/hello world/);
  });
});
