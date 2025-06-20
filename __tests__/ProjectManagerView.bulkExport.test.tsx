import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectManagerView from '../src/renderer/views/ProjectManagerView';

describe('ProjectManagerView bulk export', () => {
  const listProjects = vi.fn();
  const listFormats = vi.fn();
  const exportProjects = vi.fn();
  const getProjectSort = vi.fn();
  const setProjectSort = vi.fn();

  beforeEach(() => {
    interface API {
      listProjects: () => Promise<
        Array<{
          name: string;
          version: string;
          assets: number;
          lastOpened: number;
        }>
      >;
      listFormats: () => Promise<{ format: number; label: string }[]>;
      exportProjects: (paths: string[]) => Promise<void>;
      openProject: (name: string) => void;
      createProject: (name: string, version: string) => Promise<void>;
      importProject: () => Promise<
        import('../src/main/projects').ImportSummary | null
      >;
      duplicateProject: (name: string, newName: string) => Promise<void>;
      deleteProject: (name: string) => Promise<void>;
      getProjectSort: () => Promise<{ key: keyof ProjectInfo; asc: boolean }>;
      setProjectSort: (key: keyof ProjectInfo, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      listProjects,
      listFormats,
      exportProjects,
      openProject: vi.fn(),
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      deleteProject: vi.fn(),
      getProjectSort,
      setProjectSort,
    };
    listProjects.mockResolvedValue([
      { name: 'Alpha', version: '1.21', assets: 2, lastOpened: 0 },
      { name: 'Beta', version: '1.20', assets: 3, lastOpened: 0 },
    ]);
    listFormats.mockResolvedValue([]);
    exportProjects.mockResolvedValue(undefined);
    getProjectSort.mockResolvedValue({ key: 'name', asc: true });
    setProjectSort.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('calls exportProjects with selected rows', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('checkbox');
    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Bulk Export' }));
    expect(exportProjects).toHaveBeenCalledWith(['Alpha']);
  });
});
