import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetSelector from '../src/renderer/components/AssetSelector';

describe('AssetSelector filters', () => {
  const listTextures = vi.fn();
  const getTextureUrl = vi.fn();

  beforeEach(() => {
    interface ElectronAPI {
      listTextures: (path: string) => Promise<string[]>;
      addTexture: (path: string, tex: string) => Promise<void>;
      getTextureUrl: (project: string, tex: string) => Promise<string>;
    }
    (window as unknown as { electronAPI: ElectronAPI }).electronAPI = {
      listTextures,
      addTexture: vi.fn(),
      getTextureUrl,
    };
    listTextures.mockResolvedValue([
      'block/stone.png',
      'item/apple.png',
      'entity/zombie.png',
    ]);
    getTextureUrl.mockImplementation((_p, n) => `texture://${n}`);
    vi.clearAllMocks();
  });

  it('filters textures by category chip and supports keyboard toggle', async () => {
    render(<AssetSelector path="/proj" />);
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'png' } });
    await screen.findByText('blocks');
    expect(
      screen.getByRole('button', { name: 'item/apple.png' })
    ).toBeInTheDocument();
    const itemChip = screen.getByRole('button', { name: 'Items' });
    fireEvent.click(itemChip);
    expect(
      screen.queryByRole('button', { name: 'block/stone.png' })
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'item/apple.png' })
    ).toBeInTheDocument();
    fireEvent.keyDown(itemChip, { key: 'Enter' });
    expect(
      screen.getByRole('button', { name: 'block/stone.png' })
    ).toBeInTheDocument();
  });
});
