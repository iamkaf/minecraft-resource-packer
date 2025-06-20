import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import ProjectModals from '../src/renderer/components/project/ProjectModals';
import { useAppStore } from '../src/renderer/store';

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
    } as any;
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<ProjectModals refresh={refresh} toast={toast} />);
    act(() => {
      useAppStore.getState().duplicateProject('Alpha');
    });
    const modal = await screen.findByTestId('daisy-modal');
    const form = modal.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    act(() => {
      useAppStore.getState().duplicateProject('Alpha');
    });
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
    } as any;
    const refresh = vi.fn();
    const toast = vi.fn();
    render(<ProjectModals refresh={refresh} toast={toast} />);
    act(() => {
      useAppStore.getState().deleteProject('Alpha');
    });
    await screen.findByTestId('daisy-modal');
    fireEvent.click(screen.getByText('Delete'));
    act(() => {
      useAppStore.getState().deleteProject('Alpha');
    });
    const delModal = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(delModal).getByText('Cancel'));
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
  });
});
