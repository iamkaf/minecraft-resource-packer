import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectTableHeader from '../src/renderer/components/project/ProjectTableHeader';

describe('ProjectTableHeader', () => {
  const noop = () => {};
  it('fires sort callback', () => {
    const sort = vi.fn();
    render(
      <table>
        <ProjectTableHeader
          allSelected={false}
          onSelectAll={noop}
          sortKey="name"
          asc
          onSort={sort}
        />
        <tbody></tbody>
      </table>
    );
    fireEvent.click(screen.getByText('Assets'));
    expect(sort).toHaveBeenCalledWith('assets');
  });

  it('toggles select all', () => {
    const toggle = vi.fn();
    render(
      <table>
        <ProjectTableHeader
          allSelected={false}
          onSelectAll={toggle}
          sortKey="name"
          asc
          onSort={noop}
        />
        <tbody></tbody>
      </table>
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(toggle).toHaveBeenCalledWith(true);
  });

  it('shows sort icon when active', () => {
    render(
      <table>
        <ProjectTableHeader
          allSelected={false}
          onSelectAll={noop}
          sortKey="assets"
          asc={false}
          onSort={noop}
        />
        <tbody></tbody>
      </table>
    );
    const header = screen.getByText('Assets');
    const svg = header.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('path')?.getAttribute('d')).toBe(
      'm19.5 8.25-7.5 7.5-7.5-7.5'
    );
  });
});
