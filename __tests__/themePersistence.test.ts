import { describe, it, expect, vi } from 'vitest';

import { setTheme } from '../src/main/layout';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('theme persistence', () => {
  it('persists across reloads', async () => {
    setTheme('dark');
    vi.resetModules();
    const { getTheme: reloadGet } = await import('../src/main/layout');
    expect(reloadGet()).toBe('dark');
  });
});
