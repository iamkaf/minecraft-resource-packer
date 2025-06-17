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
import AssetInfo from '../src/renderer/components/AssetInfo';
import RevisionsModal from '../src/renderer/components/RevisionsModal';
import ToastProvider from '../src/renderer/components/ToastProvider';
import { ProjectProvider } from '../src/renderer/components/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

const saveRevision = vi.fn();
const listRevisions = vi.fn();
const restoreRevision = vi.fn();
const readFile = vi.fn();
const onFileChanged = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  electronAPI.saveRevision.mockImplementation(saveRevision);
  electronAPI.listRevisions.mockImplementation(listRevisions);
  electronAPI.restoreRevision.mockImplementation(restoreRevision);
  electronAPI.readFile.mockImplementation(readFile);
  electronAPI.onFileChanged.mockImplementation(onFileChanged);
  listRevisions.mockResolvedValue(['1.png']);
  readFile.mockResolvedValue('');
  saveRevision.mockResolvedValue(undefined);
  restoreRevision.mockResolvedValue(undefined);
});

describe('Revision history', () => {
  it('saves revision on save', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <ToastProvider>
            <AssetInfo asset="a.txt" />
          </ToastProvider>
        </SetPath>
      </ProjectProvider>
    );
    const box = await screen.findByRole('textbox');
    fireEvent.change(box, { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveRevision).toHaveBeenCalledWith('/p', 'a.txt', 'hi');
  });

  it('restores a revision', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p">
          <ToastProvider>
            <RevisionsModal asset="a.txt" onClose={() => {}} />
          </ToastProvider>
        </SetPath>
      </ProjectProvider>
    );
    const btn = await screen.findByText('Restore');
    fireEvent.click(btn);
    expect(restoreRevision).toHaveBeenCalledWith('/p', 'a.txt', '1.png');
  });
});
