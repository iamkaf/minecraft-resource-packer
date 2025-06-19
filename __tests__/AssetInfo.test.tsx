import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  within,
  act,
  waitFor,
} from '@testing-library/react';
import { SetPath, electronAPI } from './test-utils';
vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
import AssetInfo from '../src/renderer/components/assets/AssetInfo';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';
import path from 'path';

describe('AssetInfo', () => {
  const readFile = electronAPI.readFile as ReturnType<typeof vi.fn>;
  const saveRevision = electronAPI.saveRevision as ReturnType<typeof vi.fn>;
  const openExternalEditor = electronAPI.openExternalEditor as ReturnType<
    typeof vi.fn
  >;
  const onFileChanged = electronAPI.onFileChanged as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    electronAPI.readFile.mockResolvedValue('');
    electronAPI.saveRevision.mockResolvedValue(undefined);
    electronAPI.openExternalEditor.mockResolvedValue(undefined);
    electronAPI.getTextureEditor.mockResolvedValue('/bin/editor');
    electronAPI.onFileChanged.mockImplementation(() => () => undefined);
  });

  it('shows placeholder when no asset', () => {
    render(
      <SetPath path="/p">
        <AssetInfo asset={null} />
      </SetPath>
    );
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('renders asset name', async () => {
    render(
      <SetPath path="/p">
        <AssetInfo asset="foo.png" />
      </SetPath>
    );
    expect(screen.getByText('foo.png')).toBeInTheDocument();
    expect(screen.getByTestId('preview-skeleton')).toBeInTheDocument();
    expect(await screen.findByTestId('preview-pane')).toBeInTheDocument();
  });

  it('opens external editor for png', async () => {
    render(
      <SetPath path="/p">
        <ToastProvider>
          <AssetInfo asset="img.png" />
        </ToastProvider>
      </SetPath>
    );
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    await waitFor(() =>
      expect(openExternalEditor).toHaveBeenCalledWith(
        path.join('/p', 'img.png')
      )
    );
  });

  it('shows toast when external editor fails', async () => {
    openExternalEditor.mockRejectedValueOnce(new Error('fail'));
    render(
      <SetPath path="/p">
        <ToastProvider>
          <AssetInfo asset="img.png" />
        </ToastProvider>
      </SetPath>
    );
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    expect(
      await screen.findAllByText('Failed to open external editor')
    ).toHaveLength(2);
  });

  it('shows modal when no external editor configured', async () => {
    electronAPI.getTextureEditor.mockResolvedValueOnce('');
    render(
      <SetPath path="/p">
        <AssetInfo asset="img.png" />
      </SetPath>
    );
    const btn = await screen.findByRole('button', { name: 'Edit Externally' });
    fireEvent.click(btn);
    expect(
      await screen.findByText('External Editor Missing')
    ).toBeInTheDocument();
    expect(openExternalEditor).not.toHaveBeenCalled();
  });

  it('edits a text file', async () => {
    readFile.mockResolvedValue('hello');
    render(
      <SetPath path="/p">
        <ToastProvider>
          <AssetInfo asset="a.txt" />
        </ToastProvider>
      </SetPath>
    );
    const box = await screen.findByRole('textbox');
    expect(box).toHaveValue('hello');
    fireEvent.change(box, { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).toHaveBeenCalledWith('/p', 'a.txt', 'new');
  });

  it('blocks invalid json', async () => {
    readFile.mockResolvedValue('{}');
    render(
      <SetPath path="/p">
        <AssetInfo asset="b.json" />
      </SetPath>
    );
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
  });

  it('updates preview on file change', async () => {
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    onFileChanged.mockImplementation((cb) => {
      changed = cb;
    });
    render(
      <SetPath path="/p">
        <AssetInfo asset="foo.png" />
      </SetPath>
    );
    const pane = await screen.findByTestId('preview-pane');
    const img = within(pane).getByRole('img') as HTMLImageElement;
    const before = img.src;
    act(() => {
      changed?.({}, { path: 'foo.png', stamp: 2 });
    });
    expect(img.src).not.toBe(before);
    expect(img.src).toContain('t=2');
  });

  it('cleans up listener on unmount', async () => {
    const off = vi.fn();
    onFileChanged.mockReturnValue(off);
    const { unmount } = render(
      <SetPath path="/p">
        <AssetInfo asset="foo.png" />
      </SetPath>
    );
    await screen.findByTestId('preview-pane');
    unmount();
    expect(off).toHaveBeenCalled();
  });
});
