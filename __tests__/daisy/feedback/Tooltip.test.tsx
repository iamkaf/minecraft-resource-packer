import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Tooltip from '../../../src/renderer/components/daisy/feedback/Tooltip';

describe('Tooltip', () => {
  it('renders tooltip wrapper', () => {
    render(
      <Tooltip tip="info" position="bottom">
        <button>btn</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('btn').parentElement;
    expect(wrapper).toHaveClass('tooltip-bottom');
    expect(wrapper).toHaveAttribute('data-tip', 'info');
  });
});
