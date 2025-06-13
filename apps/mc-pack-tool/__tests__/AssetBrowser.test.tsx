import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

import AssetBrowser from '../src/renderer/components/AssetBrowser';

const onMock = vi.fn();
const closeMock = vi.fn();

vi.mock('chokidar', () => ({
  watch: vi.fn(() => ({ on: onMock, close: closeMock })),
}));

vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(() => [
      { name: 'a.txt', isDirectory: () => false },
      { name: 'b.png', isDirectory: () => false },
    ]),
  },
}));

describe('AssetBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders files from directory', () => {
    render(<AssetBrowser path="/proj" />);
    expect(screen.getByText('a.txt')).toBeInTheDocument();
    const img = screen.getByAltText('b.png') as HTMLImageElement;
    expect(img.src).toContain('ptex://b.png');
    expect(img.style.imageRendering).toBe('pixelated');
  });

  it('context menu triggers IPC calls', async () => {
    const openInFolder = vi.fn();
    const openFile = vi.fn();
    const renameFile = vi.fn();
    const deleteFile = vi.fn();
    (
      window as unknown as {
        electronAPI: {
          openInFolder: typeof openInFolder;
          openFile: typeof openFile;
          renameFile: typeof renameFile;
          deleteFile: typeof deleteFile;
        };
      }
    ).electronAPI = {
      openInFolder,
      openFile,
      renameFile,
      deleteFile,
    };
    render(<AssetBrowser path="/proj" />);
    const item = screen.getByText('a.txt');
    fireEvent.contextMenu(item);
    const revealBtn = (
      await screen.findAllByRole('menuitem', { name: 'Reveal' })
    )[0];
    fireEvent.click(revealBtn);
    expect(openInFolder).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Open' }))[0]
    );
    expect(openFile).toHaveBeenCalledWith('/proj/a.txt');
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
    expect(renameFile).toHaveBeenCalledWith('/proj/a.txt', '/proj/renamed.txt');
    expect(screen.queryByTestId('rename-modal')).toBeNull();
    fireEvent.contextMenu(item);
    fireEvent.click(
      (await screen.findAllByRole('menuitem', { name: 'Delete' }))[0]
    );
    const modal = await screen.findByTestId('delete-modal');
    fireEvent.click(within(modal).getByText('Delete'));
    expect(deleteFile).toHaveBeenCalledWith('/proj/a.txt');
    expect(modal).not.toBeInTheDocument();
  });
});
