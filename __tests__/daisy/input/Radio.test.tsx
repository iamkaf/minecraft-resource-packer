import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Radio } from '../../../src/renderer/components/daisy/input';

describe('Radio', () => {
  it('renders variant and size', () => {
    render(<Radio data-testid="radio" variant="warning" size="sm" />);
    const el = screen.getByTestId('radio');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('radio-warning');
    expect(el).toHaveClass('radio-sm');
  });
});
