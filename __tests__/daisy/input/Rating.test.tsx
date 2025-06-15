import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Rating } from '../../../src/renderer/components/daisy/input';

describe('Rating', () => {
  it('renders', () => {
    render(<Rating data-testid="rate">*</Rating>);
    expect(screen.getByTestId('rate')).toBeInTheDocument();
  });
});
