import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserItem from '../src/renderer/components/assets/AssetBrowserItem';
import MoveFileModal from '../src/renderer/components/modals/MoveFileModal';
import {
  AssetBrowserProvider,
  useAssetBrowser,
} from '../src/renderer/components/providers/AssetBrowserProvider';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath } from './test-utils';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath } from './test-utils';
import path from 'path';

const openInFolder = vi.fn();
const openFile = vi.fn();
const deleteFile = vi.fn();
const renameFile = vi.fn();
const setNoExport = vi.fn();
const watchProject = vi.fn(async () => []);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn(() => () => undefined);
const onFileRemoved = vi.fn(() => () => undefined);
const onFileRenamed = vi.fn(() => () => undefined);
const onFileChanged = vi.fn(() => () => undefined);

beforeEach(() => {
  vi.clearAllMocks();
  (
    window as unknown as {
      electronAPI: {
        openInFolder: typeof openInFolder;
        openFile: typeof openFile;
        deleteFile: typeof deleteFile;
        renameFile: typeof renameFile;
        setNoExport: typeof setNoExport;
        watchProject: typeof watchProject;
        unwatchProject: typeof unwatchProject;
        onFileAdded: typeof onFileAdded;
        onFileRemoved: typeof onFileRemoved;
        onFileRenamed: typeof onFileRenamed;
        onFileChanged: typeof onFileChanged;
      };
    }
  ).electronAPI = {
    openInFolder,
    openFile,
    deleteFile,
    renameFile,
    setNoExport,
    watchProject,
    unwatchProject,
    onFileAdded,
    onFileRemoved,
    onFileRenamed,
    onFileChanged,
  };
});

function renderItem(children: React.ReactElement) {
  return render(
    <ProjectProvider>
      <SetPath path="/proj">
        <AssetBrowserProvider>{children}</AssetBrowserProvider>
      </SetPath>
    </ProjectProvider>
  );
}

describe('AssetBrowserItem', () => {
  it('calls IPC actions from context menu', async () => {
    renderItem(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    const rmodal = await screen.findByTestId('daisy-modal');
    const input = rmodal.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'renamed.txt' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);
    expect(renameFile).toHaveBeenCalledWith(
      path.join('/proj', 'a.txt'),
      path.join('/proj', 'renamed.txt')
    );
    fireEvent.contextMenu(item);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
  });

  it('toggles noExport for selected files', () => {
    function Wrapper() {
      const { setSelected } = useAssetBrowser();
      React.useEffect(() => {
        setSelected(new Set(['a.txt', 'b.txt']));
      }, []);
      return <AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />;
    }
    renderItem(<Wrapper />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const toggle = screen.getByRole('checkbox', { name: /No Export/i });
    fireEvent.click(toggle);
    expect(setNoExport).toHaveBeenCalledWith('/proj', ['a.txt', 'b.txt'], true);
  });

  it('closes context menu on blur', () => {
    renderItem(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    const container = item.closest('div[tabindex="0"]') as HTMLElement;
    fireEvent.contextMenu(container);
    const menu = screen.getByRole('menu');
    expect(menu.style.display).toBe('block');
    fireEvent.blur(container);
    expect(menu.style.display).toBe('none');
  });

  it('menu is not dimmed when item is flagged noExport', () => {
    (window as any).electronAPI.getNoExport = vi.fn(async () => ['a.txt']);
    renderItem(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
    const item = screen.getAllByText('a.txt')[0];
    fireEvent.contextMenu(item);
    const menu = screen.getByRole('menu');
    expect(menu.className).not.toMatch('opacity-50');
  });

  it('moves file via modal', async () => {
    renderItem(<AssetBrowserItem projectPath="/proj" file="a.txt" zoom={64} />);
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
