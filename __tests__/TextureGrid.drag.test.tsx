import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextureGrid, {
  TextureInfo,
} from '../src/renderer/components/TextureGrid';

const textures: TextureInfo[] = [
  { name: 'block/stone.png', url: 'texture://stone' },
  { name: 'block/dirt.png', url: 'texture://dirt' },
];

describe('TextureGrid drag and click', () => {
  it('triggers onSelect on click', () => {
    const onSelect = vi.fn();
    render(<TextureGrid textures={textures} zoom={64} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: 'block/stone.png' });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledWith('block/stone.png');
  });

  it('sets drag data with texture name', () => {
    const onSelect = vi.fn();
    render(<TextureGrid textures={textures} zoom={64} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: 'block/stone.png' });
    const store: Record<string, string> = {};
    const transfer = {
      setData: (t: string, v: string) => {
        store[t] = v;
      },
      getData: (t: string) => store[t] ?? '',
      effectAllowed: '',
    } as DataTransfer;
    fireEvent.dragStart(btn, { dataTransfer: transfer });
    expect(store['text/plain']).toBe('block/stone.png');
    expect(transfer.effectAllowed).toBe('copy');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
