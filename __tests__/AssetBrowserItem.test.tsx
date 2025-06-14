import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/AssetBrowserItem';

const openInFolder = vi.fn();
const openFile = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (
    window as unknown as {
      electronAPI: {
        openInFolder: typeof openInFolder;
        openFile: typeof openFile;
      };
    }
  ).electronAPI = {
    openInFolder,
    openFile,
  };
});

describe('AssetBrowserItem', () => {
  it('calls IPC actions from context menu', async () => {
    const confirmDelete = vi.fn();
    const openRename = vi.fn();
    render(
      <AssetBrowserItem
        projectPath="/proj"
        file="a.txt"
        selected={new Set()}
        setSelected={() => undefined}
        noExport={new Set()}
        toggleNoExport={() => undefined}
        confirmDelete={confirmDelete}
        openRename={openRename}
      />
    );
    const item = screen.getByText('a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(openInFolder).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(openFile).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(openRename).toHaveBeenCalledWith('a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(confirmDelete).toHaveBeenCalledWith(['/proj/a.txt']);
  });

  it('toggles noExport for selected files', () => {
    const toggleNoExport = vi.fn();
    const selected = new Set(['a.txt', 'b.txt']);
    render(
      <AssetBrowserItem
        projectPath="/proj"
        file="a.txt"
        selected={selected}
        setSelected={() => undefined}
        noExport={new Set()}
        toggleNoExport={toggleNoExport}
        confirmDelete={() => undefined}
        openRename={() => undefined}
      />
    );
    const item = screen.getByText('a.txt');
    fireEvent.contextMenu(item);
    const toggle = screen.getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(toggleNoExport).toHaveBeenCalledWith(['a.txt', 'b.txt'], true);
  });
});
