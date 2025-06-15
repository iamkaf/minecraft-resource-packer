import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Pagination } from '../../../src/renderer/components/daisy/navigation';

describe('Pagination', () => {
  it('renders join container', () => {
    const { container } = render(
      <Pagination>
        <button className="btn">1</button>
      </Pagination>
    );
    expect(container.firstChild).toHaveClass('join');
  });
});
