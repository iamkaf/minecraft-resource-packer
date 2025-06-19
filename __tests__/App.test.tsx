import React, { Suspense } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import os from 'os';
import path from 'path';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAppStore } from '../src/renderer/store';

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

vi.mock('../src/renderer/components/assets/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/assets/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));
vi.mock('../src/renderer/views/ProjectManagerView', () => ({
  default: () => <div>manager</div>,
}));
vi.mock('../src/renderer/components/project/ProjectInfoPanel', () => ({
  default: ({
    onExport,
    onBack,
  }: {
    onExport: () => void;
    onBack: () => void;
  }) => {
    const path = useAppStore.getState().projectPath;
    return (
      <div>
        <button onClick={onExport}>Export Pack</button>
        <button onClick={onBack}>Back to Projects</button>
        <span>{path}</span>
      </div>
    );
  },
}));
vi.mock('../src/renderer/components/assets/AssetSelectorInfoPanel', () => ({
  default: () => <div>info</div>,
}));

function HashSync() {
  const location = useLocation();
  React.useEffect(() => {
    window.location.hash = `#${location.pathname}`;
  }, [location]);
  return null;
}

const renderApp = () =>
  render(
    <MemoryRouter>
      <HashSync />
      <Suspense fallback="loading">
        <App />
      </Suspense>
    </MemoryRouter>
  );

const proj = path.join(os.tmpdir(), 'proj');

describe('App', () => {
  let openHandler: ((e: unknown, path: string) => void) | undefined;
  const exportProject = vi.fn();
  const getConfetti = vi.fn();

  beforeEach(() => {
    window.location.hash = '#/';
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    interface ElectronAPI {
      onOpenProject: (cb: (e: unknown, path: string) => void) => void;
      exportProject: (path: string) => Promise<{
        fileCount: number;
        totalSize: number;
        durationMs: number;
        warnings: string[];
      }>;
      getEditorLayout: () => Promise<number[]>;
      setEditorLayout: (l: number[]) => void;
      loadPackMeta: () => Promise<unknown>;
      getConfetti: () => Promise<boolean>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      onOpenProject: (cb) => {
        openHandler = cb;
      },
      exportProject,
      getEditorLayout: vi.fn(async () => [20, 40, 40]),
      setEditorLayout: vi.fn(),
      loadPackMeta: vi.fn(async () => ({ version: '1.21.1', description: '' })),
      getConfetti,
    };
    getConfetti.mockResolvedValue(true);
  });

  it('shows manager then project name', async () => {
    renderApp();
    await screen.findByText('manager');
    act(() => {
      openHandler?.({}, proj);
    });
    await screen.findByText(proj);
    expect(window.location.hash).toBe('#/editor');
  });

  it('invokes exportProject when button clicked', async () => {
    renderApp();
    act(() => {
      openHandler?.({}, proj);
    });
    await screen.findByText('Export Pack');
    const btn = screen.getByText('Export Pack');
    exportProject.mockResolvedValueOnce({
      fileCount: 1,
      totalSize: 1,
      durationMs: 1,
      warnings: [],
    });
    fireEvent.click(btn);
    expect(exportProject).toHaveBeenCalledWith(proj);
  });

  it('fires confetti after successful export', async () => {
    renderApp();
    act(() => {
      openHandler?.({}, proj);
    });
    exportProject.mockResolvedValueOnce({
      fileCount: 1,
      totalSize: 1,
      durationMs: 1,
      warnings: [],
    });
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
    renderApp();
    act(() => {
      openHandler?.({}, proj);
    });
    exportProject.mockResolvedValueOnce({
      fileCount: 1,
      totalSize: 1,
      durationMs: 1,
      warnings: [],
    });
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fire.mockClear();
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(fire).not.toHaveBeenCalled();
  });

  it('skips confetti when preference disabled', async () => {
    getConfetti.mockResolvedValueOnce(false);
    renderApp();
    act(() => {
      openHandler?.({}, proj);
    });
    await screen.findByText('Export Pack');
    await act(async () => {
      await Promise.resolve();
    });
    exportProject.mockResolvedValueOnce({
      fileCount: 1,
      totalSize: 1,
      durationMs: 1,
      warnings: [],
    });
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fire.mockClear();
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(fire).not.toHaveBeenCalled();
  });

  it('shows summary modal after export', async () => {
    renderApp();
    act(() => {
      openHandler?.({}, proj);
    });
    exportProject.mockResolvedValueOnce({
      fileCount: 2,
      totalSize: 2048,
      durationMs: 500,
      warnings: ['a'],
    });
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText(/2 files/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('daisy-modal')).toBeNull();
  });
});
