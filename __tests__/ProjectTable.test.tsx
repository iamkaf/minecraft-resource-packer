import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectTable, {
  ProjectInfo,
} from '../src/renderer/components/project/ProjectTable';

describe('ProjectTable', () => {
  const projects: ProjectInfo[] = [
    { name: 'Alpha', version: '1.20', assets: 2, lastOpened: 0 },
    { name: 'Beta', version: '1.20', assets: 3, lastOpened: 0 },
  ];

  it('calls row action callbacks', () => {
    const open = vi.fn();
    const dup = vi.fn();
    const del = vi.fn();
    render(
      <ProjectTable
        projects={projects}
        sortKey="name"
        asc
        onSort={() => {}}
        selected={new Set()}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onOpen={open}
        onDuplicate={dup}
        onDelete={del}
        onRowClick={() => {}}
      />
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Open' })[0]);
    expect(open).toHaveBeenCalledWith('Alpha');
    fireEvent.click(screen.getAllByRole('button', { name: 'Duplicate' })[0]);
    expect(dup).toHaveBeenCalledWith('Alpha');
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(del).toHaveBeenCalledWith('Alpha');
  });

  it('opens and deletes via keyboard', () => {
    const open = vi.fn();
    const del = vi.fn();
    render(
      <ProjectTable
        projects={projects}
        sortKey="name"
        asc
        onSort={() => {}}
        selected={new Set()}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onOpen={open}
        onDuplicate={() => {}}
        onDelete={del}
        onRowClick={() => {}}
      />
    );
    const row = screen.getAllByRole('row')[1];
    fireEvent.doubleClick(row);
    expect(open).toHaveBeenCalledWith('Alpha');
    fireEvent.keyDown(row, { key: 'Delete' });
    expect(del).toHaveBeenCalledWith('Alpha');
  });

  it('selects rows and toggles all', () => {
    const select = vi.fn();
    const selectAll = vi.fn();
    render(
      <ProjectTable
        projects={projects}
        sortKey="name"
        asc
        onSort={() => {}}
        selected={new Set()}
        onSelect={select}
        onSelectAll={selectAll}
        onOpen={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onRowClick={() => {}}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox', { name: /Select/ })[1]);
    expect(select).toHaveBeenCalledWith('Alpha', true);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all' }));
    expect(selectAll).toHaveBeenCalledWith(true);
  });

  it('sorts when header clicked', () => {
    const sort = vi.fn();
    render(
      <ProjectTable
        projects={projects}
        sortKey="name"
        asc
        onSort={sort}
        selected={new Set()}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onOpen={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onRowClick={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Assets'));
    expect(sort).toHaveBeenCalledWith('assets');
  });

  it('shows a default icon for each project', () => {
    render(
      <ProjectTable
        projects={projects}
        sortKey="name"
        asc
        onSort={() => {}}
        selected={new Set()}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onOpen={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onRowClick={() => {}}
      />
    );
    const imgs = screen.getAllByAltText('Pack icon');
    expect(imgs.length).toBe(2);
  });

  it('shows a sort icon on the active column', () => {
    render(
      <ProjectTable
        projects={projects}
        sortKey="assets"
        asc={false}
        onSort={() => {}}
        selected={new Set()}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onOpen={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onRowClick={() => {}}
      />
    );
    const assetsHeader = screen.getByText('Assets');
    const svg = assetsHeader.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('path')?.getAttribute('d')).toBe(
      'm19.5 8.25-7.5 7.5-7.5-7.5'
    );
    const nameHeader = screen.getByText('Name');
    expect(nameHeader.querySelector('svg')).toBeNull();
  });
});
