import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Progress from '../../../src/renderer/components/daisy/feedback/Progress';

describe('Progress', () => {
  it('renders progress bar', () => {
    render(<Progress value={30} max={100} color="accent" className="extra" />);
    const bar = screen.getByTestId('progress') as HTMLProgressElement;
    expect(bar.value).toBe(30);
    expect(bar.max).toBe(100);
    expect(bar).toHaveClass('progress-accent');
    expect(bar).toHaveClass('extra');
  });
});
