import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';

import App from '../src/renderer/components/App';

vi.mock('../src/renderer/components/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));
vi.mock('../src/renderer/components/ProjectManager', () => ({
  default: () => <div>manager</div>,
}));

describe('App', () => {
  let openHandler: ((e: unknown, path: string) => void) | undefined;
  const exportProject = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      onOpenProject: (cb: (e: unknown, path: string) => void) => void;
      exportProject: (path: string) => void;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      onOpenProject: (cb) => {
        openHandler = cb;
      },
      exportProject,
    };
  });

  it('shows manager then project name', () => {
    render(<App />);
    expect(screen.getByText('manager')).toBeInTheDocument();
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    expect(screen.getByText(/Project: \/tmp\/proj/)).toBeInTheDocument();
  });

  it('invokes exportProject when button clicked', () => {
    render(<App />);
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    const btn = screen.getByText('Export Pack');
    fireEvent.click(btn);
    expect(exportProject).toHaveBeenCalledWith('/tmp/proj');
  });
});
