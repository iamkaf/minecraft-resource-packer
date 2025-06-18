import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/assets/AssetBrowserItem';
import {
  AssetBrowserProvider,
  useAssetBrowser,
} from '../src/renderer/components/providers/AssetBrowserProvider';
import path from 'path';

const openInFolder = vi.fn();
const openFile = vi.fn();
const deleteFile = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (
    window as unknown as {
      electronAPI: {
        openInFolder: typeof openInFolder;
        openFile: typeof openFile;
        deleteFile: typeof deleteFile;
      };
    }
  ).electronAPI = {
    openInFolder,
    openFile,
    deleteFile,
  };
});

describe('AssetBrowserItem', () => {
  it('calls IPC actions from context menu', async () => {
    const openRename = vi.fn();
    render(
      <AssetBrowserProvider
        noExport={new Set()}
        toggleNoExport={vi.fn()}
        openRename={openRename}
      >
        <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
      </AssetBrowserProvider>
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
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
  });

  it('toggles noExport for selected files', () => {
    const toggleNoExport = vi.fn();
    function Wrapper() {
      const { setSelected } = useAssetBrowser();
      React.useEffect(() => {
        setSelected(new Set(['a.txt', 'b.txt']));
      }, []);
      return <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />;
    }
    render(
      <AssetBrowserProvider
        noExport={new Set()}
        toggleNoExport={toggleNoExport}
        openRename={() => undefined}
      >
        <Wrapper />
      </AssetBrowserProvider>
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const toggle = screen.getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(toggleNoExport).toHaveBeenCalledWith(['a.txt', 'b.txt'], true);
  });

  it('closes context menu on blur', () => {
    render(
      <AssetBrowserProvider
        noExport={new Set()}
        toggleNoExport={() => undefined}
        openRename={() => undefined}
      >
        <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
      </AssetBrowserProvider>
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
      <AssetBrowserProvider
        noExport={new Set(['a.txt'])}
        toggleNoExport={() => undefined}
        openRename={() => undefined}
      >
        <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
      </AssetBrowserProvider>
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const menu = screen.getByRole('menu');
    expect(menu.className).not.toMatch('opacity-50');
  });
});
