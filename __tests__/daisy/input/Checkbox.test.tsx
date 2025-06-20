import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from '../../../src/renderer/components/daisy/input';

describe('Checkbox', () => {
  it('renders variant and size', () => {
    render(<Checkbox data-testid="cb" variant="success" size="lg" />);
    const el = screen.getByTestId('cb');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('checkbox-success');
    expect(el).toHaveClass('checkbox-lg');
  });
});
