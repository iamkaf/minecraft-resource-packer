import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { useProjectModals } from '../src/renderer/components/project/ProjectModals';

function Wrapper({
  refresh,
  toast,
}: {
  refresh: () => void;
  toast: (m: string, t: 'success' | 'info' | 'error') => void;
}) {
  const { modals, openDuplicate, openDelete } = useProjectModals(
    refresh,
    toast
  );
  return (
    <div>
      <button onClick={() => openDuplicate('Alpha')}>dup</button>
      <button onClick={() => openDelete('Alpha')}>del</button>
      {modals}
    </div>
  );
}

describe('ProjectModals', () => {
  it('duplicates project via modal', async () => {
    const duplicateProject = vi.fn().mockResolvedValue(undefined);
    (window as unknown as { electronAPI: { duplicateProject: typeof duplicateProject; deleteProject: () => void } }).electronAPI = {
      duplicateProject,
      deleteProject: vi.fn(),
    };
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<Wrapper refresh={refresh} toast={toast} />);
    fireEvent.click(screen.getByText('dup'));
    const modal = await screen.findByTestId('rename-modal');
    const form = modal.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    fireEvent.click(screen.getByText('dup')); // reopen
    const again = await screen.findByTestId('rename-modal');
    fireEvent.click(within(again).getByText('Cancel'));
    expect(duplicateProject).toHaveBeenCalledWith('Alpha', 'Alpha Copy');
  });

  it('deletes project via modal', async () => {
    const deleteProject = vi.fn().mockResolvedValue(undefined);
    (window as unknown as { electronAPI: { duplicateProject: () => void; deleteProject: typeof deleteProject } }).electronAPI = {
      duplicateProject: vi.fn(),
      deleteProject,
    };
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<Wrapper refresh={refresh} toast={toast} />);
    fireEvent.click(screen.getByText('del'));
    await screen.findByTestId('confirm-modal');
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('del'));
    const delModal = await screen.findByTestId('confirm-modal');
    fireEvent.click(within(delModal).getByText('Cancel'));
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
  });
});
