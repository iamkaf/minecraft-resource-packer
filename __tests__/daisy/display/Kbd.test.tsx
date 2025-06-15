import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Kbd from '../../../src/renderer/components/daisy/display/Kbd';

describe('Kbd', () => {
  it('renders', () => {
    render(<Kbd>A</Kbd>);
    expect(screen.getByTestId('kbd')).toBeInTheDocument();
  });
});
