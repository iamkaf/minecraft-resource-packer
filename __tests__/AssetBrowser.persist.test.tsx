import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ProjectProvider,
  useProject,
} from '../src/renderer/components/ProjectProvider';
import AssetBrowser from '../src/renderer/components/AssetBrowser';

const watchProject = vi.fn(async () => []);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn();
const onFileRemoved = vi.fn();
const onFileRenamed = vi.fn();
const onFileChanged = vi.fn();

const getAssetSearch = vi.fn();
const setAssetSearch = vi.fn();
const getAssetFilters = vi.fn();
const setAssetFilters = vi.fn();
const getAssetZoom = vi.fn();
const setAssetZoom = vi.fn();

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

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    watchProject,
    unwatchProject,
    onFileAdded,
    onFileRemoved,
    onFileRenamed,
    onFileChanged,
    getNoExport: vi.fn(async () => []),
    setNoExport: vi.fn(),
    getAssetSearch,
    setAssetSearch,
    getAssetFilters,
    setAssetFilters,
    getAssetZoom,
    setAssetZoom,
  } as never;
});

describe('AssetBrowser persistence', () => {
  it('loads persisted values', async () => {
    getAssetSearch.mockResolvedValue('stone');
    getAssetFilters.mockResolvedValue(['blocks']);
    getAssetZoom.mockResolvedValue(80);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await screen.findByDisplayValue('stone');
    expect(getAssetSearch).toHaveBeenCalled();
    expect(getAssetFilters).toHaveBeenCalled();
    expect(getAssetZoom).toHaveBeenCalled();
    expect(screen.getByDisplayValue('stone')).toBeInTheDocument();
    expect(screen.getByText('Blocks')).toHaveClass('badge-primary');
    expect((screen.getByTestId('zoom-range') as HTMLInputElement).value).toBe(
      '80'
    );
  });

  it('persists changes', async () => {
    getAssetSearch.mockResolvedValue('');
    getAssetFilters.mockResolvedValue([]);
    getAssetZoom.mockResolvedValue(64);
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetBrowser />
        </SetPath>
      </ProjectProvider>
    );
    await Promise.resolve();
    const input = screen.getByPlaceholderText('Search files');
    fireEvent.change(input, { target: { value: 'apple' } });
    expect(setAssetSearch).toHaveBeenLastCalledWith('apple');
    const chip = screen.getByText('Blocks');
    fireEvent.click(chip);
    expect(setAssetFilters).toHaveBeenLastCalledWith(['blocks']);
    const slider = screen.getByLabelText('Zoom');
    fireEvent.change(slider, { target: { value: '72' } });
    expect(setAssetZoom).toHaveBeenLastCalledWith(72);
  });
});
