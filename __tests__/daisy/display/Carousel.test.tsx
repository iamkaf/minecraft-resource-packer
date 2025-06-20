import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Carousel from '../../../src/renderer/components/daisy/display/Carousel';

describe('Carousel', () => {
  it('renders and accepts props', () => {
    render(
      <Carousel className="extra" id="car1">
        <div>Item</div>
      </Carousel>
    );
    const el = screen.getByTestId('carousel');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'car1');
  });
});
