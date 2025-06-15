import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Stack from '../../../src/renderer/components/daisy/layout/Stack';

describe('Stack', () => {
  it('renders stack', () => {
    const { container } = render(
      <Stack>
        <div>One</div>
        <div>Two</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass('stack');
  });
});
