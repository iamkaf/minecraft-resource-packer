import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ProjectManager from '../src/renderer/components/ProjectManager';

describe('ProjectManager', () => {
  const listProjects = vi.fn();
  const openProject = vi.fn();
  const createProject = vi.fn();
  const listVersions = vi.fn();
  const importProject = vi.fn();
  const duplicateProject = vi.fn();
  const deleteProject = vi.fn();

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
      importProject: () => Promise<void>;
      duplicateProject: (name: string, newName: string) => Promise<void>;
      deleteProject: (name: string) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listProjects,
      listVersions,
      openProject,
      createProject,
      importProject,
      duplicateProject,
      deleteProject,
    };
    listProjects.mockResolvedValue([
      { name: 'Pack', version: '1.20', assets: 2, lastOpened: 0 },
      { name: 'Alpha', version: '1.21', assets: 5, lastOpened: 1 },
    ]);
    createProject.mockResolvedValue(undefined);
    importProject.mockResolvedValue(undefined);
    duplicateProject.mockResolvedValue(undefined);
    deleteProject.mockResolvedValue(undefined);
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

  it('has daisyUI zebra table', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const table = document.querySelector('table.table-zebra');
    expect(table).not.toBeNull();
  });

  it('sorts projects when header clicked', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Name'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by version', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('MC Version'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by assets', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Assets'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by last opened', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Last opened'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('imports project when button clicked', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Import'));
    expect(importProject).toHaveBeenCalled();
  });

  it('duplicates project via prompt', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    vi.stubGlobal('prompt', () => 'Alpha Copy');
    fireEvent.click(screen.getAllByRole('button', { name: 'Duplicate' })[0]);
    expect(duplicateProject).toHaveBeenCalledWith('Alpha', 'Alpha Copy');
  });

  it('deletes project with confirmation', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    vi.stubGlobal('confirm', () => true);
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
  });

  it('filters by search term', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const search = screen.getByPlaceholderText('Search');
    fireEvent.change(search, { target: { value: 'pak' } });
    expect(screen.getByText('Pack')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('filters by version chip and combines with search', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const chip = screen.getByRole('button', { name: '1.20' });
    fireEvent.click(chip);
    expect(screen.getByText('Pack')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
    const search = screen.getByPlaceholderText('Search');
    fireEvent.change(search, { target: { value: 'pack' } });
    expect(screen.getByText('Pack')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('search input has reasonable width', async () => {
    render(<ProjectManager />);
    await screen.findAllByRole('button', { name: 'Open' });
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('w-40');
  });
});
