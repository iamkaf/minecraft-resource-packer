import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Skeleton from '../../../src/renderer/components/daisy/feedback/Skeleton';

describe('Skeleton', () => {
  it('renders skeleton with size', () => {
    render(<Skeleton width="2rem" height="1rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '2rem', height: '1rem' });
  });
});
