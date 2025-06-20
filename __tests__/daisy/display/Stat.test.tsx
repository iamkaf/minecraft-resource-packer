import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stat from '../../../src/renderer/components/daisy/display/Stat';

describe('Stat', () => {
  it('renders and accepts props', () => {
    render(<Stat title="T" value="V" className="extra" id="s1" />);
    const el = screen.getByTestId('stat');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 's1');
  });
});
