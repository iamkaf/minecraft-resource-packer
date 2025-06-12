import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import AssetSelector from '../src/renderer/components/AssetSelector';

describe('AssetSelector', () => {
  const listTextures = vi.fn();
  const addTexture = vi.fn();
  const getTexturePath = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, texture: string) => Promise<void>;
      getTexturePath: (project: string, tex: string) => Promise<string>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture,
      getTexturePath,
    };
    listTextures.mockResolvedValue(['grass.png', 'stone.png']);
    getTexturePath.mockResolvedValue('/img/grass.png');
    vi.clearAllMocks();
  });

  it('lists textures and handles selection', async () => {
    render(<AssetSelector path="/proj" />);
    expect(listTextures).toHaveBeenCalledWith('/proj');
    const item = await screen.findByText('grass.png');
    const img = (await screen.findByAltText('grass.png')) as HTMLImageElement;
    expect(getTexturePath).toHaveBeenCalledWith('/proj', 'grass.png');
    expect(img.src).toContain('/img/grass.png');
    fireEvent.click(item);
    expect(addTexture).toHaveBeenCalledWith('/proj', 'grass.png');
  });
});
