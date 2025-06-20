import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectManagerView from '../src/renderer/views/ProjectManagerView';
import type { ProjectInfo } from '../src/renderer/components/project/ProjectTable';

describe('ProjectManagerView hotkeys', () => {
  const listProjects = vi.fn();
  const listFormats = vi.fn();
  const openProject = vi.fn();
  const deleteProject = vi.fn();
  const getProjectSort = vi.fn();
  const setProjectSort = vi.fn();

  beforeEach(() => {
    interface API {
      listProjects: () => Promise<ProjectInfo[]>;
      listFormats: () => Promise<{ format: number; label: string }[]>;
      openProject: (name: string) => void;
      deleteProject: (name: string) => Promise<void>;
      createProject: (name: string, version: string) => Promise<void>;
      importProject: () => Promise<
        import('../src/main/projects').ImportSummary | null
      >;
      duplicateProject: (name: string, newName: string) => Promise<void>;
      getProjectSort: () => Promise<{ key: keyof ProjectInfo; asc: boolean }>;
      setProjectSort: (key: keyof ProjectInfo, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      listProjects,
      listFormats,
      openProject,
      deleteProject,
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      getProjectSort,
      setProjectSort,
    };
    listProjects.mockResolvedValue([
      { name: 'Alpha', version: '1.20', assets: 2, lastOpened: 0 },
      { name: 'Beta', version: '1.20', assets: 3, lastOpened: 1 },
    ]);
    listFormats.mockResolvedValue([]);
    deleteProject.mockResolvedValue(Promise.resolve());
    getProjectSort.mockResolvedValue({ key: 'name', asc: true });
    setProjectSort.mockResolvedValue(Promise.resolve());
    openProject.mockReset();
    deleteProject.mockReset();
  });

  it('opens all selected projects with Enter', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('checkbox');
    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[2], { ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(openProject).toHaveBeenCalledWith('Alpha');
    expect(openProject).toHaveBeenCalledWith('Beta');
  });

  it('deletes all selected projects with Delete', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('checkbox');
    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[2], { ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Delete' });
    const modal = await screen.findByText('Delete Projects');
    expect(deleteProject).not.toHaveBeenCalled();
    fireEvent.click(
      within(
        modal.closest('[data-testid="daisy-modal"]') as HTMLElement
      ).getByText('Delete')
    );
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
    expect(deleteProject).toHaveBeenCalledWith('Beta');
  });
});
