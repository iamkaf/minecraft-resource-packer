import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import RadialProgress from '../../../src/renderer/components/daisy/feedback/RadialProgress';

describe('RadialProgress', () => {
  it('renders radial progress', () => {
    render(<RadialProgress value={70} size="4rem" />);
    const el = screen.getByTestId('radial-progress');
    expect(el).toHaveTextContent('70%');
    expect(el).toHaveAttribute('aria-valuenow', '70');
  });
});
