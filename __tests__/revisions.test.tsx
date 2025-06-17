import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetInfo from '../src/renderer/components/AssetInfo';
import RevisionsModal from '../src/renderer/components/RevisionsModal';
import ToastProvider from '../src/renderer/components/ToastProvider';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';

const saveRevision = vi.fn();
const listRevisions = vi.fn();
const restoreRevision = vi.fn();
const readFile = vi.fn();
const onFileChanged = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (
    window as unknown as {
      electronAPI: {
        saveRevision: typeof saveRevision;
        listRevisions: typeof listRevisions;
        restoreRevision: typeof restoreRevision;
        readFile: typeof readFile;
        onFileChanged: typeof onFileChanged;
      };
    }
  ).electronAPI = {
    saveRevision,
    listRevisions,
    restoreRevision,
    readFile,
    onFileChanged,
  } as never;
  listRevisions.mockResolvedValue(['1.png']);
  readFile.mockResolvedValue('');
  saveRevision.mockResolvedValue(undefined);
  restoreRevision.mockResolvedValue(undefined);
});

function SetPath({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { setPath } = useProject();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setPath(path);
    setReady(true);
  }, [path]);
  return ready ? <>{children}</> : null;
}

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
