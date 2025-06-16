import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureThumb from '../src/renderer/components/TextureThumb';

describe('TextureThumb', () => {
  it('renders image with default protocol', () => {
    render(<TextureThumb texture="foo.png" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('asset://foo.png');
  });

  it('supports custom protocol', () => {
    render(<TextureThumb texture="foo.png" protocol="vanilla" simplified />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('vanilla://foo.png');
  });

  it('applies simplified mode size', () => {
    render(<TextureThumb texture="foo.png" simplified size={32} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.style.width).toBe('32px');
  });
});
