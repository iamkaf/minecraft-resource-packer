import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SelectorInfoPanel from '../src/renderer/components/SelectorInfoPanel';

describe('SelectorInfoPanel', () => {
  it('shows placeholder without asset', () => {
    render(<SelectorInfoPanel asset={null} />);
    expect(screen.getByText(/no asset/i)).toBeInTheDocument();
  });

  it('renders asset name', () => {
    render(<SelectorInfoPanel asset="block/dirt.png" />);
    expect(screen.getByText('block/dirt.png')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'texture://block/dirt.png');
  });
});
