import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectSidebar from '../src/renderer/components/project/ProjectSidebar';

describe('ProjectSidebar', () => {
  it('loads metadata when given a project', async () => {
    const load = vi.fn().mockResolvedValue({
      version: '1.21.1',
      description: 'A pack',
      author: 'Me',
      urls: ['https://a.com'],
      created: 0,
      license: '',
    });
    interface API {
      loadPackMeta: typeof load;
      savePackMeta: () => void;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
      savePackMeta: vi.fn(),
    };
    render(<ProjectSidebar project="Pack" />);
    expect(load).toHaveBeenCalledWith('Pack');
    await screen.findByText('A pack');
  });

  it('shows placeholder without a project', () => {
    const load = vi.fn();
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
      savePackMeta: vi.fn(),
    };
    render(<ProjectSidebar project={null} />);
    expect(screen.getByText(/select a project/i)).toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();
  });

  it('updates when project changes', async () => {
    const load = vi
      .fn()
      .mockResolvedValueOnce({
        version: '1.21.1',
        description: 'First',
        author: '',
        urls: [],
        created: 0,
        license: '',
      })
      .mockResolvedValueOnce({
        version: '1.21.1',
        description: 'Second',
        author: '',
        urls: [],
        created: 0,
        license: '',
      });
    interface API {
      loadPackMeta: typeof load;
      savePackMeta: () => void;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      loadPackMeta: load,
      savePackMeta: vi.fn(),
    };
    const { rerender } = render(<ProjectSidebar project="A" />);
    await screen.findByText('First');
    rerender(<ProjectSidebar project="B" />);
    expect(load).toHaveBeenLastCalledWith('B');
    await screen.findByText('Second');
    expect(screen.queryByText('First')).toBeNull();
  });
});
