import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import path from 'path';
import FileTreeContextMenu from '../src/renderer/components/assets/FileTreeContextMenu';
import { useAppStore } from '../src/renderer/store';

beforeEach(() => {
  useAppStore.setState({
    projectPath: '/proj',
    selectedAssets: ['a.txt'],
    noExport: new Set(),
    renameTarget: null,
    moveTarget: null,
  });
});

describe('FileTreeContextMenu', () => {
  it('fires callbacks and updates store', async () => {
    const openInFolder = vi.fn();
    const openFile = vi.fn();
    const deleteFile = vi.fn();
    const setNoExport = vi.fn();
    (window as unknown as { electronAPI: Window['electronAPI'] }).electronAPI = Object.assign(
      window.electronAPI ?? {},
      {
        openInFolder,
        openFile,
        deleteFile,
        setNoExport,
      }
    );
    render(
      <FileTreeContextMenu file="a.txt" position={{ x: 0, y: 0 }} />
    );
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('ul')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Reveal' })).toHaveFocus()
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(openInFolder).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(openFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(useAppStore.getState().renameTarget).toBe('a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move…' }));
    expect(useAppStore.getState().moveTarget).toBe('a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: /Delete/ }));
    expect(deleteFile).toHaveBeenCalledWith(path.join('/proj', 'a.txt'));
    fireEvent.click(screen.getByRole('checkbox', { name: /No Export/i }));
    expect(useAppStore.getState().noExport.has('a.txt')).toBe(true);
  });
});
