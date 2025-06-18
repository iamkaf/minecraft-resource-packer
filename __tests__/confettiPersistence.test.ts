import { describe, it, expect, vi } from 'vitest';
import os from 'os';

import { setConfetti } from '../src/main/layout';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir() } }));

describe('confetti persistence', () => {
  it('persists across reloads', async () => {
    setConfetti(false);
    vi.resetModules();
    const { getConfetti: reloadGet } = await import('../src/main/layout');
    expect(reloadGet()).toBe(false);
  });
});
