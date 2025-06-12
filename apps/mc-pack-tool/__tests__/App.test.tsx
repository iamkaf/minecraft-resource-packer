import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';

import App from '../src/renderer/components/App';

vi.mock('../src/renderer/components/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));

describe('App', () => {
  let openHandler: ((e: unknown, path: string) => void) | undefined;

  beforeEach(() => {
    (window as any).electronAPI = {
      onOpenProject: (cb: typeof openHandler) => {
        openHandler = cb;
      },
    };
  });

  it('shows placeholder then project name', () => {
    render(<App />);
    expect(screen.getByText(/No project loaded/)).toBeInTheDocument();
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    expect(screen.getByText(/Project: \/tmp\/proj/)).toBeInTheDocument();
  });
});
