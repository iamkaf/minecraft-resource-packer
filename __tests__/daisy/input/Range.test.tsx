import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Range } from '../../../src/renderer/components/daisy/input';

describe('Range', () => {
  it('renders and accepts className', () => {
    render(<Range data-testid="rng" className="extra" />);
    const el = screen.getByTestId('rng');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
