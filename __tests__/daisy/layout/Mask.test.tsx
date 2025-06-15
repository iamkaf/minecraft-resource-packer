import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Mask from '../../../src/renderer/components/daisy/layout/Mask';

describe('Mask', () => {
  it('renders mask with type', () => {
    const { container } = render(
      <Mask type="mask-squircle">
        <img src="test.png" alt="" />
      </Mask>
    );
    expect(container.firstChild).toHaveClass('mask');
    expect(container.firstChild).toHaveClass('mask-squircle');
  });
});
