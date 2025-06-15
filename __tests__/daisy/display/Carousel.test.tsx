import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Carousel from '../../../src/renderer/components/daisy/display/Carousel';

describe('Carousel', () => {
  it('renders', () => {
    render(
      <Carousel>
        <div>Item</div>
      </Carousel>
    );
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });
});
