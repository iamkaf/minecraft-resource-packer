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
  author: 'me',
  urls: ['https://a.com'],
  created: 0,
  license: '',
};

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

describe('ProjectInfoPanel metadata editing', () => {
  const load = vi.fn();
  const save = vi.fn();

  beforeEach(() => {
    (
      window as unknown as {
        electronAPI: {
          loadPackMeta: typeof load;
          savePackMeta: typeof save;
          openInFolder: () => void;
        };
      }
    ).electronAPI = {
      loadPackMeta: load,
      savePackMeta: save,
      openInFolder: vi.fn(),
    } as never;
    load.mockResolvedValue(meta);
    save.mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('opens modal and saves edited metadata', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/p/Pack">
          <ProjectInfoPanel
            onExport={vi.fn()}
            onBack={vi.fn()}
            onSettings={vi.fn()}
          />
        </SetPath>
      </ProjectProvider>
    );

    await screen.findByText('desc');
    fireEvent.click(screen.getByText('desc'));
    await screen.findByTestId('daisy-modal');
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'new desc' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(save).toHaveBeenCalledWith(
      'Pack',
      expect.objectContaining({ description: 'new desc' })
    );
    await screen.findByText('new desc');
  });
});
