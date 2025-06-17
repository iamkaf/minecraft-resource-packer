import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';
vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
import AssetInfo from '../src/renderer/components/AssetInfo';
import ToastProvider from '../src/renderer/components/ToastProvider';
import path from 'path';

describe('AssetInfo', () => {
  const readFile = vi.fn();
  const saveRevision = vi.fn();
  const openExternalEditor = vi.fn();
  const onFileChanged = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (
      window as unknown as {
        electronAPI: {
          readFile: typeof readFile;
          saveRevision: typeof saveRevision;
          openExternalEditor: typeof openExternalEditor;
          onFileChanged: typeof onFileChanged;
        };
      }
    ).electronAPI = {
      readFile,
      saveRevision,
      openExternalEditor,
      onFileChanged,
    } as never;
    readFile.mockResolvedValue('');
    saveRevision.mockResolvedValue(undefined);
    openExternalEditor.mockResolvedValue(undefined);
  });

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

  it('shows placeholder when no asset', () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetInfo asset={null} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('renders asset name', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetInfo asset="foo.png" />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByText('foo.png')).toBeInTheDocument();
    expect(screen.getByTestId('preview-skeleton')).toBeInTheDocument();
    expect(await screen.findByTestId('preview-pane')).toBeInTheDocument();
  });

  it('opens external editor for png', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <ToastProvider>
            <AssetInfo asset="img.png" />
          </ToastProvider>
        </SetPath>
      </ProjectProvider>
    );
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    expect(openExternalEditor).toHaveBeenCalledWith(path.join('/p', 'img.png'));
  });

  it('shows toast when external editor fails', async () => {
    openExternalEditor.mockRejectedValueOnce(new Error('fail'));
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <ToastProvider>
            <AssetInfo asset="img.png" />
          </ToastProvider>
        </SetPath>
      </ProjectProvider>
    );
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    expect(
      await screen.findAllByText('Failed to open external editor')
    ).toHaveLength(2);
  });

  it('edits a text file', async () => {
    readFile.mockResolvedValue('hello');
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <ToastProvider>
            <AssetInfo asset="a.txt" />
          </ToastProvider>
        </SetPath>
      </ProjectProvider>
    );
    const box = await screen.findByRole('textbox');
    expect(box).toHaveValue('hello');
    fireEvent.change(box, { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).toHaveBeenCalledWith('/p', 'a.txt', 'new');
  });

  it('blocks invalid json', async () => {
    readFile.mockResolvedValue('{}');
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetInfo asset="b.json" />
        </SetPath>
      </ProjectProvider>
    );
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
  });

  it('updates preview on file change', async () => {
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    onFileChanged.mockImplementation((cb) => {
      changed = cb;
    });
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <AssetInfo asset="foo.png" />
        </SetPath>
      </ProjectProvider>
    );
    const pane = await screen.findByTestId('preview-pane');
    const img = within(pane).getByRole('img') as HTMLImageElement;
    const before = img.src;
    act(() => {
      changed?.({}, { path: 'foo.png', stamp: 2 });
    });
    expect(img.src).not.toBe(before);
    expect(img.src).toContain('t=2');
  });
});
