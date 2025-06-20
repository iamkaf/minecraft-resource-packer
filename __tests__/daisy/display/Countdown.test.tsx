import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Countdown from '../../../src/renderer/components/daisy/display/Countdown';

describe('Countdown', () => {
  it('renders and accepts props', () => {
    render(<Countdown value={10} className="extra" id="cd1" />);
    const el = screen.getByTestId('countdown');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'cd1');
  });
});
