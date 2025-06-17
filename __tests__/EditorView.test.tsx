import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

import EditorView from '../src/renderer/views/EditorView';
import UndoRedoProvider from '../src/renderer/components/UndoRedoProvider';

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
vi.mock('../src/renderer/components/AssetSelectorInfoPanel', () => ({
  default: () => <div>info</div>,
}));

const summary = {
  fileCount: 1,
  totalSize: 1024,
  durationMs: 1000,
  warnings: [],
};

function SetPath({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { setPath } = useProject();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setPath(path);
    setReady(true);
  }, [path]);
  return ready ? <>{children}</> : null;
}

describe('EditorView', () => {
  const exportProject = vi.fn();

  const getLayout = vi.fn(async () => [20, 80]);
  const setLayout = vi.fn();
  const getConfetti = vi.fn(async () => true);

  beforeEach(() => {
    interface API {
      exportProject: (path: string) => Promise<typeof summary>;
      getEditorLayout: () => Promise<number[]>;
      setEditorLayout: (l: number[]) => void;
      getConfetti: () => Promise<boolean>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      exportProject,
      getEditorLayout: getLayout,
      setEditorLayout: setLayout,
      getConfetti,
    };
    exportProject.mockResolvedValue(summary);
    openExternalMock.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('shows project path and exports pack', async () => {
    render(
      <ProjectProvider>
        <UndoRedoProvider>
          <SetPath path="/tmp/proj">
            <EditorView onBack={() => undefined} />
          </SetPath>
        </UndoRedoProvider>
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
        <UndoRedoProvider>
          <SetPath path="/tmp">
            <EditorView onBack={back} />
          </SetPath>
        </UndoRedoProvider>
      </ProjectProvider>
    );
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(back).toHaveBeenCalled();
  });

  it('opens help link externally', () => {
    render(
      <ProjectProvider>
        <UndoRedoProvider>
          <SetPath path="/tmp">
            <EditorView onBack={() => undefined} />
          </SetPath>
        </UndoRedoProvider>
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
        <UndoRedoProvider>
          <SetPath path="/tmp">
            <EditorView onBack={() => undefined} />
          </SetPath>
        </UndoRedoProvider>
      </ProjectProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add From Vanilla' }));
    expect(screen.getByTestId('asset-selector-modal')).toBeInTheDocument();
  });
});
