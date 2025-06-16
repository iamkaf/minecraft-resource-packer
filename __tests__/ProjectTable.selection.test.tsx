import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectTable, {
  ProjectInfo,
} from '../src/renderer/components/project/ProjectTable';

describe('ProjectTable selection', () => {
  const projects: ProjectInfo[] = [
    { name: 'One', version: '1.20', assets: 1, lastOpened: 0 },
    { name: 'Two', version: '1.20', assets: 1, lastOpened: 0 },
    { name: 'Three', version: '1.20', assets: 1, lastOpened: 0 },
  ];

  const noop = () => {};

  it('selects a range with shift-click', () => {
    const selected = new Set<string>();
    const select = (n: string, c: boolean) => {
      if (c) selected.add(n);
      else selected.delete(n);
    };

    render(
      <ProjectTable
        projects={projects}
        onSort={noop}
        selected={selected}
        onSelect={select}
        onSelectAll={noop}
        onOpen={noop}
        onDuplicate={noop}
        onDelete={noop}
        onRowClick={noop}
      />
    );

    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    expect(selected.has('One')).toBe(true);
    fireEvent.click(boxes[3], { shiftKey: true });
    expect(selected.has('Two')).toBe(true);
    expect(selected.has('Three')).toBe(true);
  });

  it('keeps selections when rows reorder', () => {
    const selected = new Set<string>();
    const select = (n: string, c: boolean) => {
      if (c) selected.add(n);
      else selected.delete(n);
    };

    const { rerender } = render(
      <ProjectTable
        projects={projects}
        onSort={noop}
        selected={selected}
        onSelect={select}
        onSelectAll={noop}
        onOpen={noop}
        onDuplicate={noop}
        onDelete={noop}
        onRowClick={noop}
      />
    );

    const boxes = screen.getAllByRole('checkbox', { name: /Select/ });
    fireEvent.click(boxes[1]);
    expect(selected.has('One')).toBe(true);

    rerender(
      <ProjectTable
        projects={[...projects].reverse()}
        onSort={noop}
        selected={selected}
        onSelect={select}
        onSelectAll={noop}
        onOpen={noop}
        onDuplicate={noop}
        onDelete={noop}
        onRowClick={noop}
      />
    );

    const row = screen.getByText('One').closest('tr') as HTMLElement;
    const box = within(row).getByRole('checkbox');
    expect(box).toBeChecked();
  });
});
