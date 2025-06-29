import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
import RevisionsModal from '../src/renderer/components/modals/RevisionsModal';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';
import { SetPath, electronAPI } from './test-utils';

const saveRevision = vi.fn();
const listRevisions = vi.fn();
const restoreRevision = vi.fn();
const deleteRevision = vi.fn();
const readFile = vi.fn();
const onFileChanged = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  electronAPI.saveRevision.mockImplementation(saveRevision);
  electronAPI.listRevisions.mockImplementation(listRevisions);
  electronAPI.restoreRevision.mockImplementation(restoreRevision);
  electronAPI.deleteRevision.mockImplementation(deleteRevision);
  electronAPI.readFile.mockImplementation(readFile);
  electronAPI.onFileChanged.mockImplementation(onFileChanged);
  listRevisions.mockResolvedValue(['1.png']);
  readFile.mockResolvedValue('');
  saveRevision.mockResolvedValue(undefined);
  restoreRevision.mockResolvedValue(undefined);
  deleteRevision.mockResolvedValue(undefined);
});

describe('Revision history', () => {
  it('saves revision on save', async () => {
    render(
      <SetPath path="/p">
        <ToastProvider>
          <AssetInfo asset="a.txt" />
        </ToastProvider>
      </SetPath>
    );
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).toHaveBeenCalledWith('/p', 'a.txt', 'hi');
  });

  it('confirms restore', async () => {
    render(
      <SetPath path="/p">
        <ToastProvider>
          <RevisionsModal asset="a.txt" onClose={() => {}} />
        </ToastProvider>
      </SetPath>
    );
    const btn = await screen.findByText('Restore');
    fireEvent.click(btn);
    expect(screen.getByText('Restore Revision')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Restore')[1]);
    expect(restoreRevision).toHaveBeenCalledWith('/p', 'a.txt', '1.png');
  });

  it('deletes a revision after confirm', async () => {
    render(
      <SetPath path="/p">
        <ToastProvider>
          <RevisionsModal asset="a.txt" onClose={() => {}} />
        </ToastProvider>
      </SetPath>
    );
    fireEvent.click(await screen.findByText('Delete'));
    expect(screen.getByText('Delete Revision')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('Delete')[1]);
    expect(deleteRevision).toHaveBeenCalledWith('/p', 'a.txt', '1.png');
  });

  it('cancels when dialog dismissed', async () => {
    render(
      <SetPath path="/p">
        <ToastProvider>
          <RevisionsModal asset="a.txt" onClose={() => {}} />
        </ToastProvider>
      </SetPath>
    );
    fireEvent.click(await screen.findByText('Restore'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(restoreRevision).not.toHaveBeenCalled();
  });

  it('closes on Escape or Enter', async () => {
    const onClose = vi.fn();
    render(
      <SetPath path="/p">
        <ToastProvider>
          <RevisionsModal asset="a.txt" onClose={onClose} />
        </ToastProvider>
      </SetPath>
    );
    const dialog = screen.getByTestId('daisy-modal');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
