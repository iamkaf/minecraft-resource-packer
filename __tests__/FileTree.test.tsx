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
        <AssetBrowserProvider
          noExport={new Set()}
          toggleNoExport={vi.fn()}
          openRename={vi.fn()}
        >
          <Wrapper />
        </AssetBrowserProvider>
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
        <AssetBrowserProvider
          noExport={new Set()}
          toggleNoExport={vi.fn()}
          openRename={vi.fn()}
        >
          <Wrapper />
        </AssetBrowserProvider>
      </ProjectProvider>
    );
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    fireEvent.contextMenu(b);
    const delBtn = screen.getByRole('menuitem', { name: /Delete/ });
    fireEvent.click(delBtn);
    expect(del).toHaveBeenCalledWith(path.join('/proj', 'b.png'));
  });
});
