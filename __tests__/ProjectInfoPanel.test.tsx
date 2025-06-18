import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import ProjectInfoPanel from '../src/renderer/components/project/ProjectInfoPanel';

const meta = {
  version: '1.21.1',
  description: 'desc',
  author: '',
  urls: [],
  created: 0,
  license: '',
};

describe('ProjectInfoPanel', () => {
  const load = electronAPI.loadPackMeta as ReturnType<typeof vi.fn>;
  const open = electronAPI.openInFolder as ReturnType<typeof vi.fn>;
  const onExport = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    load.mockResolvedValue(meta);
    open.mockResolvedValue(undefined);
  });

  it('loads metadata and triggers export', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p/Pack">
          <ProjectInfoPanel
            onExport={onExport}
            onBack={onBack}
            onSettings={vi.fn()}
          />
        </SetPath>
      </ProjectProvider>
    );
    expect(load).toHaveBeenCalledWith('Pack');
    await screen.findByText('desc');
    fireEvent.click(screen.getByText('Export Pack'));
    expect(onExport).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Open Folder'));
    expect(open).toHaveBeenCalledWith('/p/Pack');
    fireEvent.click(screen.getByText('Back to Projects'));
    expect(onBack).toHaveBeenCalled();
    expect(screen.getByText('Pack')).toBeInTheDocument();
  });

  it('falls back to default icon when pack.png missing', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p/Pack">
          <ProjectInfoPanel
            onExport={onExport}
            onBack={onBack}
            onSettings={vi.fn()}
          />
        </SetPath>
      </ProjectProvider>
    );
    const img = screen.getByAltText('Pack icon') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toContain('default_pack');
  });
});
