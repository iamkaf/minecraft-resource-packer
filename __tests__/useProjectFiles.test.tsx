import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjectFiles } from '../src/renderer/components/file/useProjectFiles';

const watchProject = vi.fn(async () => ['a.txt', 'b.png']);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn();
const onFileRemoved = vi.fn();
const onFileRenamed = vi.fn();
const getNoExport = vi.fn(async () => []);
const setNoExport = vi.fn();

declare global {
  interface Window {
    electronAPI?: {
      watchProject: typeof watchProject;
      unwatchProject: typeof unwatchProject;
      onFileAdded: typeof onFileAdded;
      onFileRemoved: typeof onFileRemoved;
      onFileRenamed: typeof onFileRenamed;
      getNoExport: typeof getNoExport;
      setNoExport: typeof setNoExport;
    };
  }
}

describe('useProjectFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as unknown as { electronAPI: Window['electronAPI'] }).electronAPI =
      {
        watchProject,
        unwatchProject,
        onFileAdded,
        onFileRemoved,
        onFileRenamed,
        getNoExport,
        setNoExport,
      };
  });

  it('watches project and handles events', async () => {
    let added: ((e: unknown, p: string) => void) | undefined;
    let removed: ((e: unknown, p: string) => void) | undefined;
    let renamed:
      | ((e: unknown, args: { oldPath: string; newPath: string }) => void)
      | undefined;
    onFileAdded.mockImplementation((cb) => {
      added = cb;
    });
    onFileRemoved.mockImplementation((cb) => {
      removed = cb;
    });
    onFileRenamed.mockImplementation((cb) => {
      renamed = cb;
    });
    const { result, unmount } = renderHook(() => useProjectFiles('/proj'));
    await waitFor(() =>
      expect(result.current.files).toEqual(['a.txt', 'b.png'])
    );
    act(() => {
      added?.({}, 'c.txt');
    });
    expect(result.current.files).toContain('c.txt');
    act(() => {
      removed?.({}, 'a.txt');
    });
    expect(result.current.files).not.toContain('a.txt');
    act(() => {
      renamed?.({}, { oldPath: 'b.png', newPath: 'd.png' });
    });
    expect(result.current.files).toContain('d.png');
    unmount();
    expect(unwatchProject).toHaveBeenCalledWith('/proj');
  });

  it('toggles noExport state', async () => {
    const { result } = renderHook(() => useProjectFiles('/proj'));
    await waitFor(() => expect(result.current.files.length).toBeGreaterThan(0));
    act(() => {
      result.current.toggleNoExport(['a.txt'], true);
    });
    expect(setNoExport).toHaveBeenCalledWith('/proj', ['a.txt'], true);
    expect(result.current.noExport.has('a.txt')).toBe(true);
  });
});
