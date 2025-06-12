import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import AssetSelector from '../src/renderer/components/AssetSelector';

describe('AssetSelector', () => {
  const listTextures = vi.fn();
  const addTexture = vi.fn();
  const getTextureData = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, texture: string) => Promise<void>;
      getTextureData: (project: string, tex: string) => Promise<string>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture,
      getTextureData,
    };
    listTextures.mockResolvedValue(['grass.png', 'stone.png']);
    getTextureData.mockResolvedValue('data:image/png;base64,AAA');
    vi.clearAllMocks();
  });

  it('lists textures and handles selection', async () => {
    render(<AssetSelector path="/proj" />);
    expect(listTextures).toHaveBeenCalledWith('/proj');
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'grass' } });
    const item = await screen.findByText('grass.png');
    const img = (await screen.findByAltText('grass.png')) as HTMLImageElement;
    expect(getTextureData).toHaveBeenCalledWith('/proj', 'grass.png');
    expect(img.src).toContain('data:image/png;base64,AAA');
    fireEvent.click(item);
    expect(addTexture).toHaveBeenCalledWith('/proj', 'grass.png');
  });
});
