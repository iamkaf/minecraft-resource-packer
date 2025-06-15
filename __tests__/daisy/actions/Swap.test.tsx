import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Swap from '../../../src/renderer/components/daisy/actions/Swap';

describe('daisy Swap', () => {
  it('renders swap', () => {
    render(<Swap onContent="On" offContent="Off" />);
    expect(screen.getByTestId('daisy-swap')).toBeInTheDocument();
  });
});
