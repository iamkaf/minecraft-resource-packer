import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Range } from '../../../src/renderer/components/daisy/input';

describe('Range', () => {
  it('renders', () => {
    render(<Range data-testid="rng" />);
    expect(screen.getByTestId('rng')).toBeInTheDocument();
  });
});
