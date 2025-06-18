import { describe, it, expect, vi } from 'vitest';
import os from 'os';
import { setProjectSort } from '../src/main/layout';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir() } }));

describe('project sort persistence', () => {
  it('persists across reloads', async () => {
    setProjectSort('assets', false);
    vi.resetModules();
    const { getProjectSort } = await import('../src/main/layout');
    expect(getProjectSort()).toEqual({ key: 'assets', asc: false });
  });
});
