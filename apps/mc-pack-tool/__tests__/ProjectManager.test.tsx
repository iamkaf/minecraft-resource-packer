import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ProjectManager from '../src/renderer/components/ProjectManager';

describe('ProjectManager', () => {
  const listProjects = vi.fn();
  const openProject = vi.fn();
  const createProject = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listProjects: () => Promise<Array<{ name: string; version: string }>>;
      openProject: (name: string) => void;
      createProject: (name: string, version: string) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listProjects,
      openProject,
      createProject,
    };
    listProjects.mockResolvedValue([{ name: 'Pack', version: '1.20' }]);
    createProject.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('renders projects and opens them', async () => {
    render(<ProjectManager />);
    const item = await screen.findByText('Pack (1.20)');
    fireEvent.click(item);
    expect(openProject).toHaveBeenCalledWith('Pack');
  });

  it('creates project via form', async () => {
    render(<ProjectManager />);
    await screen.findByText('Pack (1.20)');
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'New' },
    });
    fireEvent.change(screen.getByPlaceholderText('Version'), {
      target: { value: '1.21' },
    });
    fireEvent.click(screen.getByText('Create'));
    expect(createProject).toHaveBeenCalledWith('New', '1.21');
  });
});
