import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectContextMenu from '../src/renderer/components/project/ProjectContextMenu';
import ProjectModals from '../src/renderer/components/project/ProjectModals';
import { useAppStore } from '../src/renderer/store';

describe('ProjectContextMenu', () => {
  it('fires callbacks and renders to overlay root', async () => {
    const open = vi.fn();
    (
      window as unknown as { electronAPI: { openProject: typeof open } }
    ).electronAPI = {
      openProject: open,
    } as any;
    render(
      <>
        <ProjectContextMenu project="Test" />
        <ProjectModals refresh={() => {}} toast={() => {}} />
      </>
    );
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
