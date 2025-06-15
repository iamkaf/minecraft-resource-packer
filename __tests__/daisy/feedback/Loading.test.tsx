import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Loading from '../../../src/renderer/components/daisy/feedback/Loading';

describe('Loading', () => {
  it('renders spinner by default', () => {
    render(<Loading />);
    const el = screen.getByTestId('loading');
    expect(el).toHaveClass('loading-spinner');
  });

  it('supports other styles', () => {
    render(<Loading style="dots" size="lg" />);
    const el = screen.getByTestId('loading');
    expect(el).toHaveClass('loading-dots');
    expect(el).toHaveClass('loading-lg');
  });
});
