import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
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
