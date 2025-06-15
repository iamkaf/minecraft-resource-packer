import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetInfo from '../src/renderer/components/AssetInfo';
import path from 'path';

describe('AssetInfo', () => {
  const readFile = vi.fn();
  const writeFile = vi.fn();
  const openExternalEditor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (
      window as unknown as {
        electronAPI: {
          readFile: typeof readFile;
          writeFile: typeof writeFile;
          openExternalEditor: typeof openExternalEditor;
        };
      }
    ).electronAPI = {
      readFile,
      writeFile,
      openExternalEditor,
    } as never;
    readFile.mockResolvedValue('');
    writeFile.mockResolvedValue(undefined);
  });

  it('shows placeholder when no asset', () => {
    render(<AssetInfo projectPath="/p" asset={null} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('renders asset name', async () => {
    render(<AssetInfo projectPath="/p" asset="foo.png" />);
    expect(screen.getByText('foo.png')).toBeInTheDocument();
    expect(await screen.findByTestId('preview-pane')).toBeInTheDocument();
  });

  it('opens external editor for png', async () => {
    render(<AssetInfo projectPath="/p" asset="img.png" />);
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    expect(openExternalEditor).toHaveBeenCalledWith(path.join('/p', 'img.png'));
  });

  it('edits a text file', async () => {
    readFile.mockResolvedValue('hello');
    render(<AssetInfo projectPath="/p" asset="a.txt" />);
    const box = await screen.findByRole('textbox');
    expect(box).toHaveValue('hello');
    fireEvent.change(box, { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(writeFile).toHaveBeenCalledWith(path.join('/p', 'a.txt'), 'new');
  });

  it('blocks invalid json', async () => {
    readFile.mockResolvedValue('{}');
    render(<AssetInfo projectPath="/p" asset="b.json" />);
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(writeFile).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
  });
});
