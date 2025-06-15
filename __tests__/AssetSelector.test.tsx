import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';

import AssetSelector from '../src/renderer/components/AssetSelector';

describe('AssetSelector', () => {
  const listTextures = vi.fn();
  const addTexture = vi.fn();
  const onSelect = vi.fn();
  const getTextureUrl = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, texture: string) => Promise<void>;
      getTextureUrl: (project: string, tex: string) => Promise<string>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture,
      getTextureUrl,
    };
    listTextures.mockResolvedValue([
      'block/grass.png',
      'item/axe.png',
      'other/custom.png',
    ]);
    getTextureUrl.mockImplementation((_p, n) => `texture://${n}`);
    vi.clearAllMocks();
    onSelect.mockClear();
  });

  it('lists textures and handles selection', async () => {
    render(<AssetSelector path="/proj" onAssetSelect={onSelect} />);
    expect(listTextures).toHaveBeenCalledWith('/proj');
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    const section = await screen.findByText('blocks');
    expect(section.parentElement).not.toBeNull();
    const sectionParent = section.parentElement as HTMLElement;
    const button = within(sectionParent).getByRole('button', {
      name: 'block/grass.png',
    });
    const img = within(sectionParent).getByAltText('Grass') as HTMLImageElement;
    expect(getTextureUrl).toHaveBeenCalledWith('/proj', 'block/grass.png');
    expect(img.src).toContain('texture://block/grass.png');
    fireEvent.click(button);
    expect(addTexture).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('block/grass.png');
  });

  it('shows items in the items category', async () => {
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'axe' } });
    const section = await screen.findByText('items');
    expect(section.parentElement).not.toBeNull();
    const itemParent = section.parentElement as HTMLElement;
    expect(
      within(itemParent).getByRole('button', {
        name: 'item/axe.png',
      })
    ).toBeInTheDocument();
  });

  it('puts uncategorized textures into misc', async () => {
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'custom' } });
    const section = await screen.findByText('misc');
    expect(section.parentElement).not.toBeNull();
    const miscParent = section.parentElement as HTMLElement;
    expect(
      within(miscParent).getByRole('button', {
        name: 'other/custom.png',
      })
    ).toBeInTheDocument();
  });

  it('adjusts zoom level with slider', async () => {
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    const img = (await screen.findByAltText('Grass')) as HTMLImageElement;
    expect(img.style.width).toBe('64px');
    expect(img.style.imageRendering).toBe('pixelated');
    const slider = screen.getByLabelText('Zoom');
    fireEvent.change(slider, { target: { value: '100' } });
    expect(img.style.width).toBe('100px');
  });

  it('renders only visible items', async () => {
    listTextures.mockResolvedValue(
      Array.from({ length: 50 }, (_, i) => `block/test${i}.png`)
    );
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'test' } });
    await screen.findByText('blocks');
    expect(
      screen.getAllByRole('button', { name: /block\/test/ }).length
    ).toBeLessThan(50);
  });

  it('toggles tree view', async () => {
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    await screen.findByText('blocks');
    fireEvent.click(screen.getByRole('button', { name: 'Tree view' }));
    expect(await screen.findByText('block/grass.png')).toBeInTheDocument();
  });
});
