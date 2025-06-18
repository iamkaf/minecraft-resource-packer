import { describe, it, expect, vi } from 'vitest';
import { setDefaultExportDir } from '../src/main/layout';
import os from 'os';
vi.mock('electron', async () => {
  const osModule = await import('os');
  return { app: { getPath: () => osModule.tmpdir() } };
});

describe('default export dir persistence', () => {
  it('persists across reloads', async () => {
    setDefaultExportDir(os.tmpdir());
    vi.resetModules();
    const { getDefaultExportDir } = await import('../src/main/layout');
    expect(getDefaultExportDir()).toBe(os.tmpdir());
  });
});
