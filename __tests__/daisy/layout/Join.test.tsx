import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Join from '../../../src/renderer/components/daisy/layout/Join';

describe('Join', () => {
  it('renders join group', () => {
    const { container } = render(
      <Join>
        <input type="text" />
      </Join>
    );
    expect(container.firstChild).toHaveClass('join');
  });
});
