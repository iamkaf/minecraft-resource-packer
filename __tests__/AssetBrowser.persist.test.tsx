import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import AssetBrowser from '../src/renderer/components/assets/AssetBrowser';
import { AssetBrowserProvider } from '../src/renderer/components/providers/AssetBrowserProvider';

const watchProject = vi.fn(async () => []);
const unwatchProject = vi.fn();
const onFileAdded = vi.fn(() => () => undefined);
const onFileRemoved = vi.fn(() => () => undefined);
const onFileRenamed = vi.fn(() => () => undefined);
const onFileChanged = vi.fn(() => () => undefined);

const getAssetSearch = vi.fn();
const setAssetSearch = vi.fn();
const getAssetFilters = vi.fn();
const setAssetFilters = vi.fn();
const getAssetZoom = vi.fn();
const setAssetZoom = vi.fn();

function renderBrowser() {
  return render(
    <ProjectProvider>
      <SetPath path="/proj">
        <AssetBrowserProvider>
          <AssetBrowser />
        </AssetBrowserProvider>
      </SetPath>
    </ProjectProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  electronAPI.watchProject.mockImplementation(watchProject);
  electronAPI.unwatchProject.mockImplementation(unwatchProject);
  electronAPI.onFileAdded.mockImplementation(onFileAdded);
  electronAPI.onFileRemoved.mockImplementation(onFileRemoved);
  electronAPI.onFileRenamed.mockImplementation(onFileRenamed);
  electronAPI.onFileChanged.mockImplementation(onFileChanged);
  electronAPI.getNoExport.mockResolvedValue([]);
  electronAPI.setNoExport.mockImplementation(() => undefined);
  electronAPI.getAssetSearch.mockImplementation(getAssetSearch);
  electronAPI.setAssetSearch.mockImplementation(setAssetSearch);
  electronAPI.getAssetFilters.mockImplementation(getAssetFilters);
  electronAPI.setAssetFilters.mockImplementation(setAssetFilters);
  electronAPI.getAssetZoom.mockImplementation(getAssetZoom);
  electronAPI.setAssetZoom.mockImplementation(setAssetZoom);
});

describe('AssetBrowser persistence', () => {
  it('loads persisted values', async () => {
    getAssetSearch.mockResolvedValue('stone');
    getAssetFilters.mockResolvedValue(['blocks']);
    getAssetZoom.mockResolvedValue(80);
    renderBrowser();
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
    renderBrowser();
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
