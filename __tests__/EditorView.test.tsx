import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

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
vi.mock('../src/renderer/components/providers/AssetBrowserProvider', () => ({
  AssetBrowserProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAssetBrowser: () => ({
    selected: new Set<string>(),
    setSelected: vi.fn(),
    files: [],
    versions: {},
    noExport: new Set(),
    toggleNoExport: vi.fn(),
    deleteFiles: vi.fn(),
    openRename: vi.fn(),
    openMove: vi.fn(),
  }),
}));
vi.mock('../src/renderer/components/project/ProjectInfoPanel', () => ({
  default: ({
    onExport,
    onBack,
  }: {
    onExport: () => void;
    onBack: () => void;
  }) => {
    const { path } = useProject();
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
    render(
      <ProjectProvider>
        <SetPath path="/tmp/proj">
          <EditorView onBack={() => undefined} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText('/tmp/proj')).toBeInTheDocument();
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(exportProject).toHaveBeenCalledWith('/tmp/proj');
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
  });

  it('calls onBack when Back clicked', () => {
    const back = vi.fn();
    render(
      <ProjectProvider>
        <SetPath path="/tmp">
          <EditorView onBack={back} />
        </SetPath>
      </ProjectProvider>
    );
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(back).toHaveBeenCalled();
  });

  it('opens help link externally', () => {
    render(
      <ProjectProvider>
        <SetPath path="/tmp">
          <EditorView onBack={() => undefined} />
        </SetPath>
      </ProjectProvider>
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
      <ProjectProvider>
        <SetPath path="/tmp">
          <EditorView onBack={() => undefined} />
        </SetPath>
      </ProjectProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add From Vanilla' }));
    expect(screen.getByTestId('asset-selector-modal')).toBeInTheDocument();
  });
});
