import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import path from 'path';
import FileTree from '../src/renderer/components/FileTree';

const files = ['a.txt', 'b.png'];

function Wrapper(props: Partial<Parameters<typeof FileTree>[0]>) {
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  return (
    <FileTree
      projectPath="/proj"
      files={files}
      selected={sel}
      setSelected={setSel}
      noExport={new Set()}
      toggleNoExport={vi.fn()}
      deleteFiles={vi.fn()}
      openRename={vi.fn()}
      {...props}
    />
  );
}

describe('FileTree', () => {
  it('supports multi selection', () => {
    render(<Wrapper />);
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
    render(<Wrapper deleteFiles={del} />);
    const b = screen.getAllByText('b.png')[0].parentElement as HTMLElement;
    fireEvent.contextMenu(b);
    const delBtn = screen.getByRole('menuitem', { name: /Delete/ });
    fireEvent.click(delBtn);
    expect(del).toHaveBeenCalledWith([path.join('/proj', 'b.png')]);
  });
});
