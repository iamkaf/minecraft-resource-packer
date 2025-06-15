import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Link } from '../../../src/renderer/components/daisy/navigation';

describe('Link', () => {
  it('renders anchor with link class', () => {
    render(<Link href="#">Test</Link>);
    const anchor = screen.getByText('Test');
    expect(anchor).toHaveClass('link');
    expect(anchor).toHaveAttribute('href', '#');
  });
});
