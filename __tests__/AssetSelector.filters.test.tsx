import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath, electronAPI } from './test-utils';
import AssetSelector from '../src/renderer/components/assets/AssetSelector';

describe('AssetSelector filters', () => {
  const listTextures = electronAPI.listTextures as ReturnType<typeof vi.fn>;
  const getTextureUrl = electronAPI.getTextureUrl as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    listTextures.mockResolvedValue([
      'block/stone.png',
      'item/apple.png',
      'entity/zombie.png',
    ]);
    getTextureUrl.mockImplementation((_p, n) => `vanilla://${n}`);
    vi.clearAllMocks();
  });

  it('filters textures by category chip and supports keyboard toggle', async () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <AssetSelector />
        </SetPath>
      </ProjectProvider>
    );
    const input = screen.getByPlaceholderText('Search texture');
    fireEvent.change(input, { target: { value: 'png' } });
    await screen.findByText('blocks');
    expect(
      screen.getByRole('button', { name: 'item/apple.png' })
    ).toBeInTheDocument();
    const itemChip = screen.getByRole('button', { name: 'Items' });
    fireEvent.click(itemChip);
    expect(itemChip).toHaveClass('badge-primary');
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
    expect(itemChip).not.toHaveClass('badge-primary');
  });
});
