import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timeline from '../../../src/renderer/components/daisy/display/Timeline';

describe('Timeline', () => {
  it('renders', () => {
    render(
      <Timeline>
        <li>Step</li>
      </Timeline>
    );
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });
});
