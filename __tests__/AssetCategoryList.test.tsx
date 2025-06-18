import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AssetCategoryList from '../src/renderer/components/assets/AssetCategoryList';
import { TextureInfo } from '../src/renderer/components/assets/TextureGrid';

const textures: TextureInfo[] = [
  { name: 'block/stone.png', url: 'vanilla://block/stone.png' },
  { name: 'item/apple.png', url: 'vanilla://item/apple.png' },
  { name: 'other/custom.png', url: 'vanilla://other/custom.png' },
];

describe('AssetCategoryList', () => {
  it('renders textures grouped by category', async () => {
    const handleSelect = vi.fn();
    render(
      <AssetCategoryList
        textures={textures}
        zoom={64}
        onSelect={handleSelect}
      />
    );
    const blocks = screen.getByText('blocks');
    const items = screen.getByText('items');
    const misc = screen.getByText('misc');
    expect(blocks).toBeInTheDocument();
    expect(items).toBeInTheDocument();
    expect(misc).toBeInTheDocument();
    const blockGrid = blocks.parentElement as HTMLElement;
    const btn = within(blockGrid).getByRole('button', {
      name: 'block/stone.png',
    });
    fireEvent.click(btn);
    expect(handleSelect).toHaveBeenCalledWith('block/stone.png');
  });
});
