import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import path from 'path';
import FileTree from '../src/renderer/components/FileTree';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

const files = ['a.txt', 'b.png'];

function Wrapper(props: Partial<Parameters<typeof FileTree>[0]>) {
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const { setPath } = useProject();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setPath('/proj');
    setReady(true);
  }, []);
  return ready ? (
    <FileTree
      files={files}
      selected={sel}
      setSelected={setSel}
      noExport={new Set()}
      toggleNoExport={vi.fn()}
      deleteFiles={vi.fn()}
      openRename={vi.fn()}
      versions={{}}
      {...props}
    />
  ) : null;
}

describe('FileTree', () => {
  it('supports multi selection', () => {
    render(
      <ProjectProvider>
        <Wrapper />
      </ProjectProvider>
    );
    fireEvent.click(
      screen.getAllByText('a.txt')[0].parentElement as HTMLElement
    );
    const a = screen.getAllByText('a.txt')[0].parentElement as HTMLElement;
    expect(a.className).toMatch(/bg-base-300/);
    fireEvent.click(
      screen.getAllByText('b.png')[0].parentElement as HTMLElement,
      { ctrlKey: true }
    );
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    expect(a.className).toMatch(/bg-base-300/);
    expect(b.className).toMatch(/bg-base-300/);
  });

  it('context menu triggers actions', () => {
    const del = vi.fn();
    render(
      <ProjectProvider>
        <Wrapper deleteFiles={del} />
      </ProjectProvider>
    );
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    fireEvent.contextMenu(b);
    const delBtn = screen.getByRole('menuitem', { name: /Delete/ });
    fireEvent.click(delBtn);
    expect(del).toHaveBeenCalledWith([path.join('/proj', 'b.png')]);
  });
});
