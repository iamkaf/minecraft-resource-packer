import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ProjectManager from '../src/renderer/components/ProjectManager';

describe('ProjectManager', () => {
  const listProjects = vi.fn();
  const openProject = vi.fn();
  const createProject = vi.fn();
  const listVersions = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listProjects: () => Promise<Array<{ name: string; version: string }>>;
      listVersions: () => Promise<string[]>;
      openProject: (name: string) => void;
      createProject: (name: string, version: string) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listProjects,
      listVersions,
      openProject,
      createProject,
    };
    listProjects.mockResolvedValue([{ name: 'Pack', version: '1.20' }]);
    createProject.mockResolvedValue(undefined);
    listVersions.mockResolvedValue(['1.20', '1.21']);
    vi.clearAllMocks();
  });

  it('renders projects and opens them', async () => {
    render(<ProjectManager />);
    const btn = await screen.findByRole('button', { name: 'Open' });
    fireEvent.click(btn);
    expect(openProject).toHaveBeenCalledWith('Pack');
  });

  it('loads available versions', async () => {
    render(<ProjectManager />);
    const option = await screen.findByRole('option', { name: '1.21' });
    expect(option).toBeInTheDocument();
  });

  it('creates project via form', async () => {
    render(<ProjectManager />);
    await screen.findByRole('button', { name: 'Open' });
    const select = await screen.findByRole('combobox');
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'New' },
    });
    fireEvent.change(select, { target: { value: '1.21' } });
    fireEvent.click(screen.getByText('Create'));
    expect(createProject).toHaveBeenCalledWith('New', '1.21');
  });
});
