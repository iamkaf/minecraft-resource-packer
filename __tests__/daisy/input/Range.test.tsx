import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Range } from '../../../src/renderer/components/daisy/input';

describe('Range', () => {
  it('renders variant and size', () => {
    render(
      <Range data-testid="rng" variant="error" size="xs" className="extra" />
    );
    const el = screen.getByTestId('rng');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('range-error');
    expect(el).toHaveClass('range-xs');
    expect(el).toHaveClass('extra');
  });
});
