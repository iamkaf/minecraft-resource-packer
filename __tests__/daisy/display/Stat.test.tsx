import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stat from '../../../src/renderer/components/daisy/display/Stat';

describe('Stat', () => {
  it('renders', () => {
    render(<Stat title="T" value="V" />);
    expect(screen.getByTestId('stat')).toBeInTheDocument();
  });
});
