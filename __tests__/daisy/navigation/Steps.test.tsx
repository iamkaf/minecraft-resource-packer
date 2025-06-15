import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Steps } from '../../../src/renderer/components/daisy/navigation';

describe('Steps', () => {
  it('renders steps list', () => {
    const { container } = render(
      <Steps>
        <li className="step">1</li>
      </Steps>
    );
    expect(container.firstChild).toHaveClass('steps');
  });
});
