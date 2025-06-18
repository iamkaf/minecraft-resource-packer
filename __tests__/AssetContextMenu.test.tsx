import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssetContextMenu from '../src/renderer/components/file/AssetContextMenu';

describe('AssetContextMenu', () => {
  it('fires callbacks when menu items clicked', async () => {
    const reveal = vi.fn();
    const open = vi.fn();
    const rename = vi.fn();
    const move = vi.fn();
    const del = vi.fn();
    const toggle = vi.fn();
    render(
      <AssetContextMenu
        filePath="/proj/a.txt"
        selectionCount={1}
        noExportChecked={false}
        onReveal={reveal}
        onOpen={open}
        onRename={rename}
        onDelete={del}
        onMove={move}
        onToggleNoExport={toggle}
      />
    );
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('ul')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Reveal' })).toHaveFocus()
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(reveal).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(open).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(rename).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Move…' }));
    expect(move).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(del).toHaveBeenCalledWith('/proj/a.txt');
    fireEvent.click(screen.getByRole('checkbox', { name: /No Export/i }));
    expect(toggle).toHaveBeenCalledWith(true);
  });
});
