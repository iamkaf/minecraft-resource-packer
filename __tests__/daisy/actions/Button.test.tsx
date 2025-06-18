import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../../../src/renderer/components/daisy/actions/Button';
describe('daisy Button', () => {
  it('renders button', () => {
    render(<Button variant="secondary">Click</Button>);
    const btn = screen.getByTestId('daisy-button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('btn-secondary');
  });
});
