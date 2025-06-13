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
      listProjects: () => Promise<
        Array<{
          name: string;
          version: string;
          assets: number;
          lastOpened: number;
        }>
      >;
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
    listProjects.mockResolvedValue([
      { name: 'Pack', version: '1.20', assets: 2, lastOpened: 0 },
      { name: 'Alpha', version: '1.21', assets: 5, lastOpened: 0 },
    ]);
    createProject.mockResolvedValue(undefined);
    listVersions.mockResolvedValue(['1.20', '1.21']);
    vi.clearAllMocks();
  });

  it('renders projects and opens them', async () => {
    render(<ProjectManager />);
    const buttons = await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(buttons[0]);
    expect(openProject).toHaveBeenCalledWith('Alpha');
  });

  it('loads available versions', async () => {
    render(<ProjectManager />);
    const option = await screen.findByRole('option', { name: '1.21' });
    expect(option).toBeInTheDocument();
  });

  it('uses generated name when input left unchanged', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const input = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const select = await screen.findByRole('combobox');
    const generated = input.value;
    fireEvent.change(select, { target: { value: '1.21' } });
    fireEvent.click(screen.getByText('Create'));
    expect(createProject).toHaveBeenCalledWith(generated, '1.21');
  });

  it('creates project via form', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const select = await screen.findByRole('combobox');
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'New' },
    });
    fireEvent.change(select, { target: { value: '1.21' } });
    fireEvent.click(screen.getByText('Create'));
    expect(createProject).toHaveBeenCalledWith('New', '1.21');
  });

  it('sorts projects when header clicked', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Name'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });
});
