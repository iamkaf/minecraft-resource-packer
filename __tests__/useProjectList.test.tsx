import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useProjectList from '../src/renderer/hooks/useProjectList';
import { electronAPI } from './test-utils';
import type { ProjectInfo } from '../src/renderer/components/project/ProjectTable';

describe('useProjectList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (electronAPI.listProjects as unknown as vi.Mock).mockResolvedValue([
      {
        name: 'Alpha',
        version: '1.20',
        assets: 2,
        lastOpened: 0,
      } as ProjectInfo,
    ]);
    (electronAPI.listPackFormats as unknown as vi.Mock).mockResolvedValue([
      { format: 1, label: '1.20' },
    ]);
    (electronAPI.getProjectSort as unknown as vi.Mock).mockResolvedValue({
      key: 'name',
      asc: true,
    });
    (electronAPI.setProjectSort as unknown as vi.Mock).mockResolvedValue(
      undefined
    );
  });

  it('loads projects and formats', async () => {
    const { result } = renderHook(() => useProjectList());
    await waitFor(() => expect(result.current.projects.length).toBe(1));
    expect(result.current.formats[0].label).toBe('1.20');
  });

  it('updates sort order', async () => {
    const { result } = renderHook(() => useProjectList());
    await waitFor(() => result.current.projects.length > 0);
    act(() => {
      result.current.handleSort('assets');
    });
    expect(electronAPI.setProjectSort).toHaveBeenLastCalledWith('assets', true);
    expect(result.current.sortKey).toBe('assets');
  });
});
