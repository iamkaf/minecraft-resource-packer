import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import os from 'os';
import path from 'path';
import { SetPath, electronAPI } from './test-utils';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAppStore } from '../src/renderer/store';

function HashSync() {
  const location = useLocation();
  React.useEffect(() => {
    window.location.hash = `#${location.pathname}`;
  }, [location]);
  return null;
}

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

import EditorView from '../src/renderer/views/EditorView';

vi.mock('react-canvas-confetti', () => ({
  __esModule: true,
  default: () => <canvas />,
}));
vi.mock('../src/renderer/components/assets/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/assets/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));
vi.mock('../src/renderer/components/project/ProjectInfoPanel', () => ({
  default: ({ onExport }: { onExport: () => void }) => {
    const path = useAppStore.getState().projectPath;
    const setProjectPath = useAppStore.getState().setProjectPath;
    return (
      <div>
        <button onClick={onExport}>Export Pack</button>
        <button
          onClick={() => {
            setProjectPath(null);
            window.location.hash = '#/';
          }}
        >
          Back to Projects
        </button>
        <span>{path}</span>
      </div>
    );
  },
}));
vi.mock('../src/renderer/components/assets/AssetSelectorInfoPanel', () => ({
  default: () => <div>info</div>,
}));

const summary = {
  fileCount: 1,
  totalSize: 1024,
  durationMs: 1000,
  warnings: [],
};

describe('EditorView', () => {
  const exportProject = vi.fn();

  const getLayout = vi.fn(async () => [20, 80]);
  const setLayout = vi.fn();
  const getConfetti = vi.fn(async () => true);

  beforeEach(() => {
    electronAPI.exportProject.mockImplementation(exportProject);
    electronAPI.getEditorLayout.mockImplementation(getLayout);
    electronAPI.setEditorLayout.mockImplementation(setLayout);
    electronAPI.getConfetti.mockImplementation(getConfetti);
    exportProject.mockResolvedValue(summary);
    openExternalMock.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('shows project path and exports pack', async () => {
    const proj = path.join(os.tmpdir(), 'proj');
    render(
      <MemoryRouter>
        <HashSync />
        <SetPath path={proj}>
          <EditorView />
        </SetPath>
      </MemoryRouter>
    );
    expect(screen.getByText(proj)).toBeInTheDocument();
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(exportProject).toHaveBeenCalledWith(proj);
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
  });

  it('navigates back when Back clicked', () => {
    render(
      <MemoryRouter>
        <HashSync />
        <SetPath path={os.tmpdir()}>
          <EditorView />
        </SetPath>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(useAppStore.getState().projectPath).toBeNull();
    expect(window.location.hash).toBe('#/');
  });

  it('opens help link externally', () => {
    render(
      <MemoryRouter>
        <HashSync />
        <SetPath path={os.tmpdir()}>
          <EditorView />
        </SetPath>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Help' });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://minecraft.wiki/w/Resource_pack'
    );
  });

  it('opens asset selector modal', () => {
    render(
      <MemoryRouter>
        <HashSync />
        <SetPath path={os.tmpdir()}>
          <EditorView />
        </SetPath>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add From Vanilla' }));
    expect(screen.getByTestId('asset-selector-modal')).toBeInTheDocument();
  });
});
