import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from '../../../src/renderer/components/daisy/input';

describe('Checkbox', () => {
  it('renders', () => {
    render(<Checkbox data-testid="cb" />);
    expect(screen.getByTestId('cb')).toBeInTheDocument();
  });
});
