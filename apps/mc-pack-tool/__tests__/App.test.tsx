import React, { Suspense } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';

import App from '../src/renderer/components/App';

const fire = vi.fn();

vi.mock('react-canvas-confetti', () => ({
  __esModule: true,
  default: (props: {
    onInit: ({ confetti }: { confetti: () => void }) => void;
  }) => {
    props.onInit({ confetti: fire });
    return <canvas />;
  },
}));

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
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
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

  it('shows manager then project name', async () => {
    render(
      <Suspense fallback="loading">
        <App />
      </Suspense>
    );
    await screen.findByText('manager');
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    expect(screen.getByText(/Project: \/tmp\/proj/)).toBeInTheDocument();
  });

  it('invokes exportProject when button clicked', async () => {
    render(
      <Suspense fallback="loading">
        <App />
      </Suspense>
    );
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    await screen.findByText('Export Pack');
    const btn = screen.getByText('Export Pack');
    exportProject.mockResolvedValueOnce(undefined);
    fireEvent.click(btn);
    expect(exportProject).toHaveBeenCalledWith('/tmp/proj');
  });

  it('fires confetti after successful export', async () => {
    render(<App />);
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    exportProject.mockResolvedValueOnce(undefined);
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fire.mockClear();
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(fire).toHaveBeenCalled();
  });

  it('skips confetti when prefers reduced motion', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    render(<App />);
    act(() => {
      openHandler?.({}, '/tmp/proj');
    });
    exportProject.mockResolvedValueOnce(undefined);
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fire.mockClear();
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(fire).not.toHaveBeenCalled();
  });
});
