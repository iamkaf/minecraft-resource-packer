import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

afterEach(() => {
  cleanup();
});

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

// ensure overlay root exists for portals
if (!document.getElementById('overlay-root')) {
  const div = document.createElement('div');
  div.id = 'overlay-root';
  document.body.appendChild(div);
}
