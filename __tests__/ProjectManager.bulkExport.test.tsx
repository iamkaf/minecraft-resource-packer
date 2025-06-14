import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectManager from '../src/renderer/components/ProjectManager';

describe('ProjectManager bulk export', () => {
  const listProjects = vi.fn();
  const listVersions = vi.fn();
  const exportProjects = vi.fn();

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
      listVersions: () => Promise<string[]>;
      exportProjects: (paths: string[]) => Promise<void>;
      openProject: (name: string) => void;
      createProject: (name: string, version: string) => Promise<void>;
      importProject: () => Promise<void>;
      duplicateProject: (name: string, newName: string) => Promise<void>;
      deleteProject: (name: string) => Promise<void>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      listProjects,
      listVersions,
      exportProjects,
      openProject: vi.fn(),
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      deleteProject: vi.fn(),
    };
    listProjects.mockResolvedValue([
      { name: 'Alpha', version: '1.21', assets: 2, lastOpened: 0 },
      { name: 'Beta', version: '1.20', assets: 3, lastOpened: 0 },
    ]);
    listVersions.mockResolvedValue([]);
    exportProjects.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('calls exportProjects with selected rows', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('checkbox');
    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Bulk Export' }));
    expect(exportProjects).toHaveBeenCalledWith(['Alpha']);
  });
});
