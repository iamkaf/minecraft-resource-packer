import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

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
vi.mock('../src/renderer/components/AssetSelector', () => ({
  default: () => <div>selector</div>,
}));
vi.mock('../src/renderer/components/AssetBrowser', () => ({
  default: () => <div>browser</div>,
}));
vi.mock('../src/renderer/components/ProjectInfoPanel', () => ({
  default: ({
    onExport,
    onBack,
    projectPath,
  }: {
    onExport: () => void;
    onBack: () => void;
    projectPath: string;
  }) => (
    <div>
      <button onClick={onExport}>Export Pack</button>
      <button onClick={onBack}>Back to Projects</button>
      <span>{projectPath}</span>
    </div>
  ),
}));
vi.mock('../src/renderer/components/AssetSelectorInfoPanel', () => ({
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

  beforeEach(() => {
    interface API {
      exportProject: (path: string) => Promise<typeof summary>;
      getEditorLayout: () => Promise<number[]>;
      setEditorLayout: (l: number[]) => void;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      exportProject,
      getEditorLayout: getLayout,
      setEditorLayout: setLayout,
    };
    exportProject.mockResolvedValue(summary);
    openExternalMock.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('shows project path and exports pack', async () => {
    render(<EditorView projectPath="/tmp/proj" onBack={() => undefined} />);
    expect(screen.getByText('/tmp/proj')).toBeInTheDocument();
    const btn = screen.getByText('Export Pack');
    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });
    expect(exportProject).toHaveBeenCalledWith('/tmp/proj');
    expect(screen.getByTestId('export-summary')).toBeInTheDocument();
  });

  it('calls onBack when Back clicked', () => {
    const back = vi.fn();
    render(<EditorView projectPath="/tmp" onBack={back} />);
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(back).toHaveBeenCalled();
  });

  it('opens help link externally', () => {
    render(<EditorView projectPath="/tmp" onBack={() => undefined} />);
    const link = screen.getByRole('link', { name: 'Help' });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://minecraft.wiki/w/Resource_pack'
    );
  });

  it('opens asset selector modal', () => {
    render(<EditorView projectPath="/tmp" onBack={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add From Vanilla' }));
    expect(screen.getByTestId('asset-selector-modal')).toBeInTheDocument();
  });
});
