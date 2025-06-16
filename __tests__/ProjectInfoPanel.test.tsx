import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';
import ProjectInfoPanel from '../src/renderer/components/ProjectInfoPanel';

const meta = {
  description: 'desc',
  author: '',
  urls: [],
  created: 0,
  license: '',
};

describe('ProjectInfoPanel', () => {
  const load = vi.fn();
  const open = vi.fn();
  const onExport = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    (
      window as unknown as {
        electronAPI: { loadPackMeta: typeof load; openInFolder: typeof open };
      }
    ).electronAPI = {
      loadPackMeta: load,
      openInFolder: open,
    } as never;
    load.mockResolvedValue(meta);
    vi.clearAllMocks();
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
    expect(screen.getByText('/p/Pack')).toBeInTheDocument();
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
