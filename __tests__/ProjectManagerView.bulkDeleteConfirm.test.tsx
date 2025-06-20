import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectManagerView from '../src/renderer/views/ProjectManagerView';
import type { ProjectInfo } from '../src/renderer/components/project/ProjectTable';

describe('ProjectManagerView bulk delete confirm', () => {
  const listProjects = vi.fn();
  const listFormats = vi.fn();
  const deleteProject = vi.fn();
  const getProjectSort = vi.fn();
  const setProjectSort = vi.fn();

  beforeEach(() => {
    interface API {
      listProjects: () => Promise<ProjectInfo[]>;
      listFormats: () => Promise<{ format: number; label: string }[]>;
      deleteProject: (name: string) => Promise<void>;
      openProject: (name: string) => void;
      createProject: (n: string, v: string) => Promise<void>;
      importProject: () => Promise<
        import('../src/main/projects').ImportSummary | null
      >;
      duplicateProject: (n: string, nn: string) => Promise<void>;
      exportProjects: (paths: string[]) => Promise<void>;
      getProjectSort: () => Promise<{ key: keyof ProjectInfo; asc: boolean }>;
      setProjectSort: (key: keyof ProjectInfo, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      listProjects,
      listFormats,
      deleteProject,
      openProject: vi.fn(),
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      exportProjects: vi.fn(),
      getProjectSort,
      setProjectSort,
    };
    listProjects.mockResolvedValue([
      { name: 'Alpha', version: '1.21', assets: 2, lastOpened: 0 },
      { name: 'Beta', version: '1.20', assets: 3, lastOpened: 0 },
    ]);
    listFormats.mockResolvedValue([]);
    deleteProject.mockResolvedValue(Promise.resolve());
    getProjectSort.mockResolvedValue({ key: 'name', asc: true });
    setProjectSort.mockResolvedValue(Promise.resolve());
    vi.clearAllMocks();
  });

  it('shows confirmation modal before deleting multiple projects', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('checkbox');
    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[2], { ctrlKey: true });
    fireEvent.keyDown(window, { key: 'Delete' });
    const modalTitle = await screen.findByText('Delete Projects');
    expect(deleteProject).not.toHaveBeenCalled();
    fireEvent.click(
      within(
        modalTitle.closest('[data-testid="daisy-modal"]') as HTMLElement
      ).getByText('Delete')
    );
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
    expect(deleteProject).toHaveBeenCalledWith('Beta');
  });
});
