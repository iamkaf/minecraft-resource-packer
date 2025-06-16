import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/AssetBrowserItem';
import path from 'path';

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
    const deleteFiles = vi.fn();
    const openRename = vi.fn();
    render(
      <AssetBrowserItem
        projectPath="/proj"
        file="a.txt"
        selected={new Set()}
        setSelected={() => undefined}
        noExport={new Set()}
        toggleNoExport={() => undefined}
        deleteFiles={deleteFiles}
        openRename={openRename}
        zoom={64}
      />
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(openRename).toHaveBeenCalledWith('a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(deleteFiles).toHaveBeenCalledWith([path.join('/proj', 'a.txt')]);
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
        deleteFiles={() => undefined}
        openRename={() => undefined}
        zoom={64}
      />
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const toggle = screen.getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(toggleNoExport).toHaveBeenCalledWith(['a.txt', 'b.txt'], true);
  });

  it('closes context menu on blur', () => {
    render(
      <AssetBrowserItem
        projectPath="/proj"
        file="a.txt"
        selected={new Set()}
        setSelected={() => undefined}
        noExport={new Set()}
        toggleNoExport={() => undefined}
        deleteFiles={() => undefined}
        openRename={() => undefined}
        zoom={64}
      />
    );
    const item = screen.getAllByText('a.txt')[0];
    const container = item.closest('div[tabindex="0"]') as HTMLElement;
    fireEvent.contextMenu(container);
    const menu = screen.getByRole('menu');
    expect(menu.style.display).toBe('block');
    fireEvent.blur(container);
    expect(menu.style.display).toBe('none');
  });

  it('menu is not dimmed when item is flagged noExport', () => {
    render(
      <AssetBrowserItem
        projectPath="/proj"
        file="a.txt"
        selected={new Set()}
        setSelected={() => undefined}
        noExport={new Set(['a.txt'])}
        toggleNoExport={() => undefined}
        deleteFiles={() => undefined}
        openRename={() => undefined}
        zoom={64}
      />
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const menu = screen.getByRole('menu');
    expect(menu.className).not.toMatch('opacity-50');
  });
});
