import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Navbar } from '../../../src/renderer/components/daisy/navigation';

describe('Navbar', () => {
  it('renders navbar container', () => {
    const { container } = render(
      <Navbar>
        <div>Content</div>
      </Navbar>
    );
    expect(container.firstChild).toHaveClass('navbar');
  });
});
