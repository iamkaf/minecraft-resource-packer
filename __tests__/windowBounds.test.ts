import { describe, it, expect, vi } from 'vitest';
import { setWindowBounds, setMaximized } from '../src/main/windowBounds';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('window bounds persistence', () => {
  it('persists across reloads', async () => {
    setWindowBounds({ x: 1, y: 2, width: 300, height: 400 });
    setMaximized(true);
    vi.resetModules();
    const { getWindowBounds, isMaximized } = await import(
      '../src/main/windowBounds'
    );
    expect(getWindowBounds()).toEqual({ x: 1, y: 2, width: 300, height: 400 });
    expect(isMaximized()).toBe(true);
  });
});
