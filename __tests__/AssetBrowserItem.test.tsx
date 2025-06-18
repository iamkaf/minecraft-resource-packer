import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/assets/AssetBrowserItem';
import MoveFileModal from '../src/renderer/components/modals/MoveFileModal';
import {
  AssetBrowserProvider,
  useAssetBrowser,
} from '../src/renderer/components/providers/AssetBrowserProvider';
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
});

describe('AssetBrowserItem', () => {
  it('calls IPC actions from context menu', async () => {
    const openRename = vi.fn();
    const openMove = vi.fn();
    render(
      <AssetBrowserProvider
        noExport={new Set()}
        toggleNoExport={vi.fn()}
        openRename={openRename}
        openMove={openMove}
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
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move…' }));
    expect(openMove).toHaveBeenCalledWith('a.txt');
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
        openMove={() => undefined}
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
        openMove={() => undefined}
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
        openMove={() => undefined}
      >
        <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
      </AssetBrowserProvider>
    );
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const menu = screen.getByRole('menu');
    expect(menu.className).not.toMatch('opacity-50');
  });

  it('moves file via modal', async () => {
    function Wrapper() {
      const [move, setMove] = React.useState<string | null>(null);
      return (
        <AssetBrowserProvider
          noExport={new Set()}
          toggleNoExport={() => undefined}
          openRename={() => undefined}
          openMove={(f) => setMove(f)}
        >
          <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />
          {move && (
            <MoveFileModal
              current={move}
              onCancel={() => setMove(null)}
              onMove={(dest) => {
                renameFile(
                  path.join('/proj', move),
                  path.join('/proj', dest, path.basename(move))
                );
                setMove(null);
              }}
            />
          )}
        </AssetBrowserProvider>
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
