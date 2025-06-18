import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import path from 'path';
import FileTree from '../src/renderer/components/assets/FileTree';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/providers/ProjectProvider';
import {
  AssetBrowserProvider,
  useAssetBrowser,
} from '../src/renderer/components/providers/AssetBrowserProvider';

const files = ['a.txt', 'b.png'];
const watchProject = vi.fn(async () => files);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn(() => () => undefined);
const onFileRemoved = vi.fn(() => () => undefined);
const onFileRenamed = vi.fn(() => () => undefined);
const onFileChanged = vi.fn(() => () => undefined);

beforeEach(() => {
  (window as any).electronAPI = {
    watchProject,
    unwatchProject,
    onFileAdded,
    onFileRemoved,
    onFileRenamed,
    onFileChanged,
    getNoExport: vi.fn(async () => []),
    setNoExport: vi.fn(),
    deleteFile: vi.fn(),
  };
});

function Wrapper(props: Partial<Parameters<typeof FileTree>[0]>) {
  const { setPath } = useProject();
  const { setSelected } = useAssetBrowser();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setPath('/proj');
    setSelected(new Set());
    setReady(true);
  }, []);
  return ready ? <FileTree files={files} versions={{}} {...props} /> : null;
}

describe('FileTree', () => {
  it('supports multi selection', () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowserProvider>
            <Wrapper />
          </AssetBrowserProvider>
        </SetPath>
      </ProjectProvider>
    );
    fireEvent.click(
      screen.getAllByText('a.txt')[0].parentElement as HTMLElement
    );
    const a = screen.getAllByText('a.txt')[0].parentElement as HTMLElement;
    expect(a.className).toMatch(/bg-base-300/);
    fireEvent.click(
      screen.getAllByText('b.png')[0].parentElement as HTMLElement,
      { ctrlKey: true }
    );
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    expect(a.className).toMatch(/bg-base-300/);
    expect(b.className).toMatch(/bg-base-300/);
  });

  it('context menu triggers actions', () => {
    const del = vi.fn();
    (
      window as unknown as { electronAPI: { deleteFile: typeof del } }
    ).electronAPI = Object.assign(window.electronAPI ?? {}, {
      deleteFile: del,
    });
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowserProvider>
            <Wrapper />
          </AssetBrowserProvider>
        </SetPath>
      </ProjectProvider>
    );
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    fireEvent.contextMenu(b);
    const delBtn = screen.getByRole('menuitem', { name: /Delete/ });
    fireEvent.click(delBtn);
    expect(del).toHaveBeenCalledWith(path.join('/proj', 'b.png'));
  });
});
