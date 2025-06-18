import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectContextMenu from '../src/renderer/components/project/ProjectContextMenu';

describe('ProjectContextMenu', () => {
  it('fires callbacks and renders to overlay root', async () => {
    const open = vi.fn();
    const dup = vi.fn();
    const del = vi.fn();
    render(
      <ProjectContextMenu
        project="Test"
        onOpen={open}
        onDuplicate={dup}
        onDelete={del}
      />
    );
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('ul')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus()
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(open).toHaveBeenCalledWith('Test');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(dup).toHaveBeenCalledWith('Test');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(del).toHaveBeenCalledWith('Test');
  });
});
