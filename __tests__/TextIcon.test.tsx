import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TextIcon from '../src/renderer/components/common/TextIcon';

describe('TextIcon', () => {
  it('renders icon with provided size', () => {
    render(<TextIcon size={32} />);
    const icon = screen.getByTestId('text-icon');
    expect(icon).toBeInTheDocument();
    expect((icon as SVGElement).style.width).toBe('32px');
  });
});
