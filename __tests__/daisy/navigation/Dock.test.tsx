import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Dock } from '../../../src/renderer/components/daisy/navigation';

describe('Dock', () => {
  it('renders dock container', () => {
    const { container } = render(
      <Dock>
        <button>One</button>
      </Dock>
    );
    expect(container.firstChild).toHaveClass('dock');
  });
});
