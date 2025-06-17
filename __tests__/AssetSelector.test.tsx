import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';

import AssetSelector from '../src/renderer/components/assets/AssetSelector';

describe('AssetSelector', () => {
  const listTextures = electronAPI.listTextures as ReturnType<typeof vi.fn>;
  const addTexture = electronAPI.addTexture as ReturnType<typeof vi.fn>;
  const getTextureUrl = electronAPI.getTextureUrl as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    electronAPI.listTextures.mockResolvedValue([
      'block/grass.png',
      'item/axe.png',
      'other/custom.png',
    ]);
    electronAPI.getTextureUrl.mockImplementation((_p, n) => `vanilla://${n}`);
    vi.clearAllMocks();
  });

  it('lists textures and handles selection', async () => {
    const onSelect = vi.fn();
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector onAssetSelect={onSelect} />
        </SetPath>
      </ProjectProvider>
    );
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
    expect(img.src).toContain('vanilla://block/grass.png');
    fireEvent.click(button);
    expect(addTexture).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('block/grass.png');
  });

  it('shows items in the items category', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
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
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
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
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
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
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'test' } });
    await screen.findByText('blocks');
    expect(
      screen.getAllByRole('button', { name: /block\/test/ }).length
    ).toBeLessThan(50);
  });

  it('shows tree view', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    await screen.findByText('blocks');
    fireEvent.click(screen.getByText('Tree'));
    expect(screen.getByText('block')).toBeInTheDocument();
    expect(screen.getByText('grass.png')).toBeInTheDocument();
  });
});
