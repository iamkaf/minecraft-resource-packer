import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyTheme, toggleTheme } from '../src/renderer/utils/theme';

describe('theme utilities', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('applies explicit theme', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('applies system theme based on media query', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    applyTheme('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles theme and updates storage', async () => {
    const getTheme = vi.fn(async () => 'light');
    const setTheme = vi.fn(async () => {});
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    (
      window as unknown as {
        electronAPI: { getTheme: typeof getTheme; setTheme: typeof setTheme };
      }
    ).electronAPI = {
      getTheme,
      setTheme,
    };
    await toggleTheme();
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'minecraft'
    );
  });
});
