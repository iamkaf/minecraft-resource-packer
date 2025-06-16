import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

import ProjectManagerView from '../src/renderer/views/ProjectManagerView';

describe('ProjectManagerView', () => {
  const listProjects = vi.fn();
  const openProject = vi.fn();
  const createProject = vi.fn();
  const listVersions = vi.fn();
  const importProject = vi.fn();
  const duplicateProject = vi.fn();
  const deleteProject = vi.fn();
  const getProjectSort = vi.fn();
  const setProjectSort = vi.fn();

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
      getProjectSort: () => Promise<{ key: keyof ProjectInfo; asc: boolean }>;
      setProjectSort: (key: keyof ProjectInfo, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listProjects,
      listVersions,
      openProject,
      createProject,
      importProject,
      duplicateProject,
      deleteProject,
      getProjectSort,
      setProjectSort,
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
    getProjectSort.mockResolvedValue({ key: 'name', asc: true });
    setProjectSort.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('renders projects and opens them', async () => {
    render(<ProjectManagerView />);
    const buttons = await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(buttons[0]);
    expect(openProject).toHaveBeenCalledWith('Alpha');
  });

  it('loads available versions', async () => {
    render(<ProjectManagerView />);
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    const option = within(modal).getByRole('option', { name: '1.21' });
    expect(option).toBeInTheDocument();
  });

  it('uses generated name when input left unchanged', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    const input = within(modal).getByPlaceholderText(
      'Name'
    ) as HTMLInputElement;
    const select = within(modal).getByRole('combobox');
    const generated = input.value;
    fireEvent.change(select, { target: { value: '1.21' } });
    fireEvent.click(within(modal).getByRole('button', { name: 'Create' }));
    expect(createProject).toHaveBeenCalledWith(generated, '1.21');
  });

  it('creates project via form', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    const select = within(modal).getByRole('combobox');
    fireEvent.change(within(modal).getByPlaceholderText('Name'), {
      target: { value: 'New' },
    });
    fireEvent.change(select, { target: { value: '1.21' } });
    fireEvent.click(within(modal).getByRole('button', { name: 'Create' }));
    expect(createProject).toHaveBeenCalledWith('New', '1.21');
  });

  it('has daisyUI zebra table', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    const table = document.querySelector('table.table-zebra');
    expect(table).not.toBeNull();
  });

  it('sorts projects when header clicked', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Name'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by version', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('MC Version'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by assets', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Assets'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('sorts by last opened', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('Last opened'));
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pack');
  });

  it('imports project when button clicked', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(modal).getByRole('tab', { name: 'Import' }));
    fireEvent.click(within(modal).getByRole('button', { name: 'Import' }));
    expect(importProject).toHaveBeenCalled();
  });

  it('duplicates project via modal', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getAllByRole('button', { name: 'Duplicate' })[0]);
    const modal = await screen.findByTestId('daisy-modal');
    const input = modal.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Alpha Copy' } });
    const form = input.closest('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    expect(duplicateProject).toHaveBeenCalledWith('Alpha', 'Alpha Copy');
  });

  it('deletes project with confirmation modal', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    const modal = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(modal).getByText('Delete'));
    expect(deleteProject).toHaveBeenCalledWith('Alpha');
  });

  it('filters by search term', async () => {
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    const search = screen.getByPlaceholderText('Search');
    fireEvent.change(search, { target: { value: 'pak' } });
    expect(screen.getByText('Pack')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('filters by version chip and combines with search', async () => {
    render(<ProjectManagerView />);
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
    render(<ProjectManagerView />);
    await screen.findAllByRole('button', { name: 'Open' });
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('w-40');
  });
});
