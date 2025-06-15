import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Divider from '../../../src/renderer/components/daisy/layout/Divider';

describe('Divider', () => {
  it('renders divider', () => {
    const { container } = render(<Divider>content</Divider>);
    expect(container.firstChild).toHaveClass('divider');
  });
});
