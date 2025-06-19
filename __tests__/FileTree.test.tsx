import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import path from 'path';
import FileTree from '../src/renderer/components/assets/FileTree';
import { useAppStore } from '../src/renderer/store';

const files = ['a.txt', 'b.png'];

function Wrapper(props: Partial<Parameters<typeof FileTree>[0]>) {
  const setProjectPath = useAppStore((s) => s.setProjectPath);
  const setSelected = useAppStore((s) => s.setSelectedAssets);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setProjectPath('/proj');
    setSelected([]);
    setReady(true);
  }, []);
  return ready ? <FileTree files={files} versions={{}} {...props} /> : null;
}

describe('FileTree', () => {
  beforeEach(() => {
    useAppStore.setState({ selectedAssets: [] });
  });

  it('supports multi selection', () => {
    render(<Wrapper />);
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
    render(<Wrapper />);
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    fireEvent.contextMenu(b);
    const delBtn = screen.getByRole('menuitem', { name: /Delete/ });
    fireEvent.click(delBtn);
    expect(del).toHaveBeenCalledWith(path.join('/proj', 'b.png'));
  });
});
