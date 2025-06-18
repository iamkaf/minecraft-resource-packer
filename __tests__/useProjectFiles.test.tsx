import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjectFiles } from '../src/renderer/components/file/useProjectFiles';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

const watchProject = vi.fn(async () => ['a.txt', 'b.png']);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn(() => () => undefined);
const onFileRemoved = vi.fn(() => () => undefined);
const onFileRenamed = vi.fn(() => () => undefined);
const onFileChanged = vi.fn(() => () => undefined);
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
      onFileChanged: typeof onFileChanged;
      getNoExport: typeof getNoExport;
      setNoExport: typeof setNoExport;
    };
  }
}

describe('useProjectFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    electronAPI.watchProject.mockImplementation(watchProject);
    electronAPI.unwatchProject.mockImplementation(unwatchProject);
    electronAPI.onFileAdded.mockImplementation(onFileAdded);
    electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
    electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
    electronAPI.onFileChanged.mockImplementation(onFileChanged);
    electronAPI.getNoExport.mockImplementation(getNoExport);
    electronAPI.setNoExport.mockImplementation(setNoExport);
  });

  it('watches project and handles events', async () => {
    let added: ((e: unknown, p: string) => void) | undefined;
    let removed: ((e: unknown, p: string) => void) | undefined;
    let renamed:
      | ((e: unknown, args: { oldPath: string; newPath: string }) => void)
      | undefined;
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    const offAdd = vi.fn();
    const offRemove = vi.fn();
    const offRename = vi.fn();
    const offChange = vi.fn();
    onFileAdded.mockImplementation((cb) => {
      added = cb;
      return offAdd;
    });
    onFileRemoved.mockImplementation((cb) => {
      removed = cb;
      return offRemove;
    });
    onFileRenamed.mockImplementation((cb) => {
      renamed = cb;
      return offRename;
    });
    onFileChanged.mockImplementation((cb) => {
      changed = cb;
      return offChange;
    });
    const { result, unmount } = renderHook(() => useProjectFiles(), {
      wrapper: ({ children }) => (
        <ProjectProvider>
          <SetPath path="/proj">{children}</SetPath>
        </ProjectProvider>
      ),
    });
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
    act(() => {
      changed?.({}, { path: 'd.png', stamp: 1 });
    });
    expect(result.current.versions['d.png']).toBe(1);
    unmount();
    expect(unwatchProject).toHaveBeenCalledWith('/proj');
    expect(offAdd).toHaveBeenCalled();
    expect(offRemove).toHaveBeenCalled();
    expect(offRename).toHaveBeenCalled();
    expect(offChange).toHaveBeenCalled();
  });

  it('ignores files in .history directories', async () => {
    watchProject.mockResolvedValue(['.history/a.txt', 'keep.txt']);
    let added: ((e: unknown, p: string) => void) | undefined;
    onFileAdded.mockImplementation((cb) => {
      added = cb;
    });
    const { result } = renderHook(() => useProjectFiles(), {
      wrapper: ({ children }) => (
        <ProjectProvider>
          <SetPath path="/proj">{children}</SetPath>
        </ProjectProvider>
      ),
    });
    await waitFor(() => expect(result.current.files).toEqual(['keep.txt']));
    act(() => {
      added?.({}, '.history/b.txt');
    });
    expect(result.current.files).toEqual(['keep.txt']);
  });

  it('toggles noExport state', async () => {
    const { result } = renderHook(() => useProjectFiles(), {
      wrapper: ({ children }) => (
        <ProjectProvider>
          <SetPath path="/proj">
            <ToastProvider>{children}</ToastProvider>
          </SetPath>
        </ProjectProvider>
      ),
    });
    await waitFor(() => expect(result.current.files.length).toBeGreaterThan(0));
    act(() => {
      result.current.toggleNoExport(['a.txt'], true);
    });
    expect(setNoExport).toHaveBeenCalledWith('/proj', ['a.txt'], true);
    expect(result.current.noExport.has('a.txt')).toBe(true);
    expect(document.body.textContent).toContain('1 file(s) added to No Export');
  });
});
