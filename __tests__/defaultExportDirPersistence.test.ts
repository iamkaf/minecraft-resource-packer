import { describe, it, expect, vi } from 'vitest';
import { setDefaultExportDir } from '../src/main/layout';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('default export dir persistence', () => {
  it('persists across reloads', async () => {
    setDefaultExportDir('/tmp');
    vi.resetModules();
    const { getDefaultExportDir } = await import('../src/main/layout');
    expect(getDefaultExportDir()).toBe('/tmp');
  });
});
