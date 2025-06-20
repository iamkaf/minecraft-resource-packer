import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectContextMenu from '../src/renderer/components/project/ProjectContextMenu';
import { useAppStore } from '../src/renderer/store';

describe('ProjectContextMenu', () => {
  it('fires callbacks and renders to overlay root', async () => {
    const open = vi.fn();
    const dup = vi.fn();
    const del = vi.fn();
    (window as unknown as { electronAPI: Window['electronAPI'] }).electronAPI =
      {
        openProject: open,
        duplicateProject: dup,
        deleteProject: del,
      } as Window['electronAPI'];
    render(<ProjectContextMenu project="Test" />);
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('ul')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus()
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(open).toHaveBeenCalledWith('Test');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(useAppStore.getState().duplicateTarget).toBe('Test');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(useAppStore.getState().deleteTarget).toBe('Test');
  });
});
