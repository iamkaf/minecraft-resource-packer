import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectSidebar from '../src/renderer/components/ProjectSidebar';

describe('ProjectSidebar', () => {
  it('loads metadata when given a project', async () => {
    const load = vi.fn().mockResolvedValue({
      description: 'A pack',
      license: 'MIT',
      authors: ['Me'],
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
    render(<ProjectSidebar project="Pack" />);
    expect(load).toHaveBeenCalledWith('Pack');
    await screen.findByText('A pack');
    expect(screen.getByText('License: MIT')).toBeInTheDocument();
    expect(screen.getByText('Authors: Me')).toBeInTheDocument();
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
        description: 'First',
        license: '',
        authors: [],
        urls: [],
        created: 0,
      })
      .mockResolvedValueOnce({
        description: 'Second',
        license: '',
        authors: [],
        urls: [],
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
    const { rerender } = render(<ProjectSidebar project="A" />);
    await screen.findByText('First');
    rerender(<ProjectSidebar project="B" />);
    expect(load).toHaveBeenLastCalledWith('B');
    await screen.findByText('Second');
    expect(screen.queryByText('First')).toBeNull();
  });
});
