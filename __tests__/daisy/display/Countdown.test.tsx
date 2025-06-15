import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Countdown from '../../../src/renderer/components/daisy/display/Countdown';

describe('Countdown', () => {
  it('renders', () => {
    render(<Countdown value={10} />);
    expect(screen.getByTestId('countdown')).toBeInTheDocument();
  });
});
