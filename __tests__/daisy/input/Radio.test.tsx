import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Radio } from '../../../src/renderer/components/daisy/input';

describe('Radio', () => {
  it('renders', () => {
    render(<Radio data-testid="radio" />);
    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });
});
