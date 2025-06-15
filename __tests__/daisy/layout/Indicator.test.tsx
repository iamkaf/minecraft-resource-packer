import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Indicator from '../../../src/renderer/components/daisy/layout/Indicator';

describe('Indicator', () => {
  it('renders indicator with item', () => {
    const { container } = render(
      <Indicator item={<span>!</span>}>child</Indicator>
    );
    expect(container.firstChild).toHaveClass('indicator');
    expect(container.querySelector('.indicator-item')).toBeInTheDocument();
  });
});
