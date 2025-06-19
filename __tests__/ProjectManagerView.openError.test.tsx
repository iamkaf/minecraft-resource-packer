import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectManagerView from '../src/renderer/views/ProjectManagerView';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';
import type { ProjectInfo } from '../src/renderer/components/project/ProjectTable';

// Test that an error toast appears when openProject fails

describe('ProjectManagerView open error', () => {
  const listProjects = vi.fn();
  const listPackFormats = vi.fn();
  const openProject = vi.fn();
  const getProjectSort = vi.fn();
  const setProjectSort = vi.fn();

  beforeEach(() => {
    interface API {
      listProjects: () => Promise<ProjectInfo[]>;
      listPackFormats: () => Promise<{ format: number; label: string }[]>;
      openProject: (name: string) => Promise<void>;
      createProject: (n: string, v: string) => Promise<void>;
      importProject: () => Promise<
        import('../src/main/projects').ImportSummary | null
      >;
      duplicateProject: (n: string, nn: string) => Promise<void>;
      deleteProject: (n: string) => Promise<void>;
      getProjectSort: () => Promise<{ key: keyof ProjectInfo; asc: boolean }>;
      setProjectSort: (key: keyof ProjectInfo, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      listProjects,
      listPackFormats,
      openProject,
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      deleteProject: vi.fn(),
      getProjectSort,
      setProjectSort,
    } as API;
    listProjects.mockResolvedValue([
      { name: 'Pack', version: '1.21', assets: 2, lastOpened: 0 },
    ]);
    listPackFormats.mockResolvedValue([]);
    openProject.mockRejectedValue(new Error('fail'));
    getProjectSort.mockResolvedValue({ key: 'name', asc: true });
    setProjectSort.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('shows toast when openProject fails', async () => {
    render(
      <ToastProvider>
        <ProjectManagerView />
      </ToastProvider>
    );
    const openBtn = (await screen.findAllByRole('button', { name: 'Open' }))[0];
    fireEvent.click(openBtn);
    expect(await screen.findAllByText('Invalid project.json')).toHaveLength(2);
  });
});
