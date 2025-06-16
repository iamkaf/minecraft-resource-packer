import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectManagerView from '../src/renderer/views/ProjectManagerView';

// eslint-disable-next-line no-var
var openExternalMock: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternalMock = vi.fn()) },
}));

describe('ProjectManagerView help link', () => {
  beforeEach(() => {
    interface ElectronAPI {
      listProjects: () => Promise<[]>;
      listPackFormats: () => Promise<{ format: number; label: string }[]>;
      openProject: (name: string) => void;
      createProject: (n: string, v: string) => Promise<void>;
      importProject: () => Promise<void>;
      duplicateProject: (n: string, nn: string) => Promise<void>;
      deleteProject: (n: string) => Promise<void>;
      getProjectSort: () => Promise<{ key: string; asc: boolean }>;
      setProjectSort: (key: string, asc: boolean) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listProjects: vi.fn().mockResolvedValue([]),
      listPackFormats: vi.fn().mockResolvedValue([]),
      openProject: vi.fn(),
      createProject: vi.fn(),
      importProject: vi.fn(),
      duplicateProject: vi.fn(),
      deleteProject: vi.fn(),
      getProjectSort: vi.fn().mockResolvedValue({ key: 'name', asc: true }),
      setProjectSort: vi.fn(),
    } as ElectronAPI;
    openExternalMock.mockResolvedValue(undefined);
  });

  it('opens wiki link externally', () => {
    render(<ProjectManagerView />);
    const link = screen.getByRole('link', { name: 'Help' });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    expect(openExternalMock).toHaveBeenCalledWith(
      'https://minecraft.wiki/w/Tutorials/Creating_a_resource_pack'
    );
  });
});
