import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/assets/AssetBrowserItem';
import MoveFileModal from '../src/renderer/components/modals/MoveFileModal';
import { useAppStore } from '../src/renderer/store';
import path from 'path';

const openInFolder = vi.fn();
const openFile = vi.fn();
const deleteFile = vi.fn();
const renameFile = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (
    window as unknown as {
      electronAPI: {
        openInFolder: typeof openInFolder;
        openFile: typeof openFile;
        deleteFile: typeof deleteFile;
        renameFile: typeof renameFile;
      };
    }
  ).electronAPI = {
    openInFolder,
    openFile,
    deleteFile,
    renameFile,
  };
  useAppStore.setState({
    selectedAssets: [],
    noExport: new Set(),
    renameTarget: null,
    moveTarget: null,
  });
});

describe('AssetBrowserItem', () => {
  it('calls IPC actions from context menu', async () => {
    render(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(useAppStore.getState().renameTarget).toBe('a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move…' }));
    expect(useAppStore.getState().moveTarget).toBe('a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
  });

  it('toggles noExport for selected files', () => {
    useAppStore.getState().setSelectedAssets(['a.txt', 'b.txt']);
    render(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const toggle = screen.getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(useAppStore.getState().noExport.has('a.txt')).toBe(true);
    expect(useAppStore.getState().noExport.has('b.txt')).toBe(true);
  });

  it('closes context menu on blur', () => {
    render(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    const container = item.closest('div[tabindex="0"]') as HTMLElement;
    fireEvent.contextMenu(container);
    const menu = screen.getByRole('menu');
    expect(menu.style.display).toBe('block');
    fireEvent.blur(container);
    expect(menu.style.display).toBe('none');
  });

  it('menu is not dimmed when item is flagged noExport', () => {
    useAppStore.setState({ noExport: new Set(['a.txt']) });
    render(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const menu = screen.getByRole('menu');
    expect(menu.className).not.toMatch('opacity-50');
  });

  it('moves file via modal', async () => {
    function Wrapper() {
      const move = useAppStore((s) => s.moveTarget);
      const close = useAppStore((s) => s.closeDialogs);
      return (
        <>
          <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
          {move && (
            <MoveFileModal
              current={move}
              onCancel={close}
              onMove={(dest) => {
                renameFile(
                  path.join('/proj', move),
                  path.join('/proj', dest, path.basename(move))
                );
                close();
              }}
            />
          )}
        </>
      );
    }
    render(<Wrapper />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move…' }));
    const modal = await screen.findByTestId('daisy-modal');
    const input = modal.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'dest' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);
    expect(renameFile).toHaveBeenCalledWith(
      path.join('/proj', 'a.txt'),
      path.join('/proj', 'dest', 'a.txt')
    );
  });
});
