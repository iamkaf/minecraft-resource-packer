import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextureGrid, {
  TextureInfo,
} from '../src/renderer/components/assets/TextureGrid';

const textures: TextureInfo[] = [
  { name: 'block/stone.png', url: 'vanilla://stone' },
  { name: 'block/dirt.png', url: 'vanilla://dirt' },
];

describe('TextureGrid', () => {
  it('triggers onSelect on click', () => {
    const onSelect = vi.fn();
    render(<TextureGrid textures={textures} zoom={64} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: 'block/stone.png' });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith('block/stone.png');
  });

  it('is not draggable', () => {
    render(<TextureGrid textures={textures} zoom={64} onSelect={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'block/stone.png' });
    expect(btn.getAttribute('draggable')).toBe(null);
  });
});
