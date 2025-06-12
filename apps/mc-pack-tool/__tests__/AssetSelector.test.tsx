import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import AssetSelector from '../src/renderer/components/AssetSelector';

describe('AssetSelector', () => {
  const listTextures = vi.fn();
  const addTexture = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, texture: string) => Promise<void>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture,
    };
    listTextures.mockResolvedValue(['grass.png', 'stone.png']);
    vi.clearAllMocks();
  });

  it('lists textures and handles selection', async () => {
    render(<AssetSelector path="/proj" />);
    expect(listTextures).toHaveBeenCalledWith('/proj');
    const item = await screen.findByText('grass.png');
    fireEvent.click(item);
    expect(addTexture).toHaveBeenCalledWith('/proj', 'grass.png');
  });
});
