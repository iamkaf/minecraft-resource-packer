import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectSidebar from '../src/renderer/components/ProjectSidebar';

describe('ProjectSidebar', () => {
  it('loads metadata when opened', async () => {
    const load = vi.fn().mockResolvedValue({
      description: 'A pack',
      author: 'Me',
      urls: ['https://a.com'],
      created: 0,
    });
    interface API {
      loadPackMeta: typeof load;
      savePackMeta: () => void;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
      savePackMeta: vi.fn(),
    };
    render(
      <ProjectSidebar project="Pack" open={true} onClose={() => undefined} />
    );
    expect(load).toHaveBeenCalledWith('Pack');
    await screen.findByText('A pack');
  });

  it('toggles visibility', () => {
    const load = vi
      .fn()
      .mockResolvedValue({ description: '', author: '', urls: [], created: 0 });
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
      savePackMeta: vi.fn(),
    };
    const { rerender } = render(
      <ProjectSidebar project="Pack" open={false} onClose={() => undefined} />
    );
    expect(screen.queryByTestId('project-sidebar')).toBeNull();
    rerender(
      <ProjectSidebar project="Pack" open={true} onClose={() => undefined} />
    );
    expect(screen.getByTestId('project-sidebar')).toBeInTheDocument();
  });
});
