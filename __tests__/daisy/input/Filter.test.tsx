import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Filter } from '../../../src/renderer/components/daisy/input';

describe('Filter', () => {
  it('renders', () => {
    render(<Filter data-testid="flt">f</Filter>);
    expect(screen.getByTestId('flt')).toBeInTheDocument();
  });
});
