import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import path from 'path';

import AssetBrowser from '../src/renderer/components/AssetBrowser';

describe('AssetBrowser', () => {
  const listFiles = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    listFiles.mockResolvedValue(['a.txt', 'b.png']);
    (
      window as unknown as { electronAPI: Record<string, unknown> }
    ).electronAPI = {
      listFiles,
      openInFolder: vi.fn(),
      openFile: vi.fn(),
      renameFile: vi.fn(),
      deleteFile: vi.fn(),
      pathJoin: path.join,
      pathBasename: path.basename,
      pathDirname: path.dirname,
    };
  });

  it('renders files from directory', async () => {
    render(<AssetBrowser path="/proj" />);
    expect(await screen.findByText('a.txt')).toBeInTheDocument();
    const img = (await screen.findByAltText('b.png')) as HTMLImageElement;
    expect(img.src).toContain('ptex://b.png');
    expect(img.style.imageRendering).toBe('pixelated');
  });

  it('context menu triggers IPC calls', async () => {
    const openInFolder = vi.fn();
    const openFile = vi.fn();
    const renameFile = vi.fn();
    const deleteFile = vi.fn();
    (
      window as unknown as { electronAPI: Record<string, unknown> }
    ).electronAPI = {
      listFiles,
      openInFolder,
      openFile,
      renameFile,
      deleteFile,
      pathJoin: path.join,
      pathBasename: path.basename,
      pathDirname: path.dirname,
    };
    render(<AssetBrowser path="/proj" />);
    const item = await screen.findByText('a.txt');
    fireEvent.contextMenu(item);
    const revealBtn = (
      await screen.findAllByRole('menuitem', { name: 'Reveal' })
    )[0];
    fireEvent.click(revealBtn);
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Open' }))[0]
    );
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Rename' }))[0]
    );
    const rmodal = await screen.findByTestId('rename-modal');
    const input = within(rmodal).getByDisplayValue('a.txt');
    fireEvent.change(input, { target: { value: 'renamed.txt' } });
    const form = input.closest('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    expect(renameFile).toHaveBeenCalledWith(
      path.join('/proj', 'a.txt'),
      path.join('/proj', 'renamed.txt')
    );
    expect(screen.queryByTestId('rename-modal')).toBeNull();
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Delete' }))[0]
    );
    const modal = await screen.findByTestId('delete-modal');
    fireEvent.click(within(modal).getByText('Delete'));
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    expect(modal).not.toBeInTheDocument();
  });
});
