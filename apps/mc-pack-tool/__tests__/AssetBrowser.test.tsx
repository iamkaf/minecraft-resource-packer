import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

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

// eslint-disable-next-line no-var
var buildMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => {
  buildMock = vi.fn(() => ({ popup: vi.fn() }));
  return { Menu: { buildFromTemplate: buildMock } };
});

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

  it('context menu triggers IPC calls', () => {
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
    const template = buildMock.mock.calls[0][0];
    vi.stubGlobal('prompt', () => 'renamed.txt');
    vi.stubGlobal('confirm', () => true);
    template[0].click();
    expect(openInFolder).toHaveBeenCalledWith('/proj/a.txt');
    template[1].click();
    expect(openFile).toHaveBeenCalledWith('/proj/a.txt');
    template[2].click();
    expect(renameFile).toHaveBeenCalledWith('/proj/a.txt', '/proj/renamed.txt');
    template[3].click();
    expect(deleteFile).toHaveBeenCalledWith('/proj/a.txt');
  });
});
