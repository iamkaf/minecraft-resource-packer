import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Footer from '../../../src/renderer/components/daisy/layout/Footer';

describe('Footer', () => {
  it('renders footer', () => {
    const { container } = render(<Footer>foot</Footer>);
    expect(container.firstChild).toHaveClass('footer');
  });
});
