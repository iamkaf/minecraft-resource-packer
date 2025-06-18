import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetBrowserControls from '../src/renderer/components/assets/AssetBrowserControls';
import { electronAPI } from './test-utils';

const getAssetSearch = vi.fn();
const setAssetSearch = vi.fn();
const getAssetFilters = vi.fn();
const setAssetFilters = vi.fn();
const getAssetZoom = vi.fn();
const setAssetZoom = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  electronAPI.getAssetSearch.mockImplementation(getAssetSearch);
  electronAPI.setAssetSearch.mockImplementation(setAssetSearch);
  electronAPI.getAssetFilters.mockImplementation(getAssetFilters);
  electronAPI.setAssetFilters.mockImplementation(setAssetFilters);
  electronAPI.getAssetZoom.mockImplementation(getAssetZoom);
  electronAPI.setAssetZoom.mockImplementation(setAssetZoom);
});

describe('AssetBrowserControls', () => {
  it('loads persisted values', async () => {
    getAssetSearch.mockResolvedValue('stone');
    getAssetFilters.mockResolvedValue(['blocks']);
    getAssetZoom.mockResolvedValue(80);
    render(<AssetBrowserControls />);
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
    render(<AssetBrowserControls />);
    await screen.findByTestId('zoom-range');
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

  it('calls onChange with current state', async () => {
    getAssetSearch.mockResolvedValue('foo');
    getAssetFilters.mockResolvedValue([]);
    getAssetZoom.mockResolvedValue(64);
    const handler = vi.fn();
    render(<AssetBrowserControls onChange={handler} />);
    await screen.findByDisplayValue('foo');
    expect(handler).toHaveBeenLastCalledWith({
      query: 'foo',
      filters: [],
      zoom: 64,
    });
    const chip = screen.getByText('Blocks');
    fireEvent.click(chip);
    expect(handler).toHaveBeenLastCalledWith({
      query: 'foo',
      filters: ['blocks'],
      zoom: 64,
    });
  });
});
