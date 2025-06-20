import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timeline from '../../../src/renderer/components/daisy/display/Timeline';

describe('Timeline', () => {
  it('renders and accepts props', () => {
    render(
      <Timeline className="extra" id="tl1">
        <li>Step</li>
      </Timeline>
    );
    const el = screen.getByTestId('timeline');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'tl1');
  });
});
