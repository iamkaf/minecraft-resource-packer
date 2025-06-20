import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectRow from '../src/renderer/components/project/ProjectRow';
import type { ProjectInfo } from '../src/renderer/components/project/ProjectTable';
import ProjectModals from '../src/renderer/components/project/ProjectModals';
import { useAppStore } from '../src/renderer/store';

describe('ProjectRow', () => {
  const projects: ProjectInfo[] = [
    { name: 'Alpha', version: '1.20', assets: 2, lastOpened: 0 },
    { name: 'Beta', version: '1.20', assets: 3, lastOpened: 0 },
  ];

  it('calls button callbacks', () => {
    const open = vi.fn();
    (
      window as unknown as { electronAPI: { openProject: typeof open } }
    ).electronAPI = {
      openProject: open,
    } as any;
    const selected = new Set<string>();
    const last = { current: null as number | null };
    render(
      <>
        <table>
          <tbody>
            <ProjectRow
              project={projects[0]}
              projects={projects}
              index={0}
              selected={selected}
              onSelect={() => {}}
              lastIndexRef={last}
              onRowClick={() => {}}
            />
          </tbody>
        </table>
        <ProjectModals refresh={() => {}} toast={() => {}} />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(open).toHaveBeenCalledWith('Alpha');
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate' }));
    expect(useAppStore.getState().duplicateTarget).toBe('Alpha');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(useAppStore.getState().deleteTarget).toBe('Alpha');
  });

  it('handles double click and key', () => {
    const open = vi.fn();
    const del = vi.fn();
    (
      window as unknown as {
        electronAPI: { openProject: typeof open; deleteProject: typeof del };
      }
    ).electronAPI = {
      openProject: open,
      deleteProject: del,
    } as any;
    const selected = new Set<string>();
    const last = { current: null as number | null };
    render(
      <table>
        <tbody>
          <ProjectRow
            project={projects[0]}
            projects={projects}
            index={0}
            selected={selected}
            onSelect={() => {}}
            lastIndexRef={last}
            onRowClick={() => {}}
          />
        </tbody>
      </table>
    );
    const row = screen.getByRole('row');
    fireEvent.doubleClick(row);
    expect(open).toHaveBeenCalledWith('Alpha');
    fireEvent.keyDown(row, { key: 'Delete' });
    expect(del).not.toHaveBeenCalled();
    expect(useAppStore.getState().deleteTarget).toBe('Alpha');
  });

  it('selects range with shift', () => {
    const selected = new Set<string>();
    const last = { current: null as number | null };
    const select = vi.fn((name: string, checked: boolean) => {
      if (checked) selected.add(name);
      else selected.delete(name);
    });
    render(
      <table>
        <tbody>
          {projects.map((p, i) => (
            <ProjectRow
              key={p.name}
              project={p}
              projects={projects}
              index={i}
              selected={selected}
              onSelect={select}
              lastIndexRef={last}
              onRowClick={() => {}}
            />
          ))}
        </tbody>
      </table>
    );
    const boxes = screen.getAllByRole('checkbox');
    fireEvent.click(boxes[0]);
    expect(select).toHaveBeenCalledWith('Alpha', true);
    fireEvent.click(boxes[1], { shiftKey: true });
    expect(select).toHaveBeenCalledWith('Beta', true);
  });
});
