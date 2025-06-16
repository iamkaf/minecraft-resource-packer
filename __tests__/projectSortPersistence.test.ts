import { describe, it, expect, vi } from 'vitest';
import { setProjectSort } from '../src/main/layout';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('project sort persistence', () => {
  it('persists across reloads', async () => {
    setProjectSort('assets', false);
    vi.resetModules();
    const { getProjectSort } = await import('../src/main/layout');
    expect(getProjectSort()).toEqual({ key: 'assets', asc: false });
  });
});
