import { describe, it, expect, vi } from 'vitest';

import { setConfetti } from '../src/main/layout';

describe('confetti persistence', () => {
  it('persists across reloads', async () => {
    setConfetti(false);
    vi.resetModules();
    const { getConfetti: reloadGet } = await import('../src/main/layout');
    expect(reloadGet()).toBe(false);
  });
});
