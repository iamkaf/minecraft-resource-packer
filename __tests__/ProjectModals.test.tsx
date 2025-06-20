import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectModals from '../src/renderer/components/project/ProjectModals';
import { useAppStore } from '../src/renderer/store';

function Wrapper({
  refresh,
  toast,
}: {
  refresh: () => void;
  toast: (m: string, t: 'success' | 'info' | 'error') => void;
}) {
  const dup = useAppStore((s) => s.duplicateProject);
  const del = useAppStore((s) => s.deleteProject);
  return (
    <div>
      <button onClick={() => dup('Alpha')}>dup</button>
      <button onClick={() => del('Alpha')}>del</button>
      <ProjectModals
        refresh={refresh}
        toast={({ message, type }) => toast(message, (type ?? 'info') as any)}
      />
    </div>
  );
}

describe('ProjectModals', () => {
  it('duplicates project via modal', async () => {
    const duplicateProject = vi.fn().mockResolvedValue(undefined);
    (
      window as unknown as {
        electronAPI: {
          duplicateProject: typeof duplicateProject;
          deleteProject: () => void;
        };
      }
    ).electronAPI = {
      duplicateProject,
      deleteProject: vi.fn(),
    };
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<Wrapper refresh={refresh} toast={toast} />);
    fireEvent.click(screen.getByText('dup'));
    const modal = await screen.findByTestId('daisy-modal');
    const form = modal.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    fireEvent.click(screen.getByText('dup')); // reopen
    const again = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(again).getByText('Cancel'));
    expect(duplicateProject).toHaveBeenCalledWith('Alpha', 'Alpha Copy');
  });

  it('deletes project via modal', async () => {
    const deleteProject = vi.fn().mockResolvedValue(undefined);
    (
      window as unknown as {
        electronAPI: {
          duplicateProject: () => void;
          deleteProject: typeof deleteProject;
        };
      }
    ).electronAPI = {
      duplicateProject: vi.fn(),
      deleteProject,
    };
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<Wrapper refresh={refresh} toast={toast} />);
    fireEvent.click(screen.getByText('del'));
    await screen.findByTestId('daisy-modal');
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('del'));
    const delModal = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(delModal).getByText('Cancel'));
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
  });
});
