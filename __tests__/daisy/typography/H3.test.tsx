import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { H3 } from '../../../src/renderer/components/daisy/typography';

describe('H3', () => {
  it('renders', () => {
    render(<H3>Heading</H3>);
    expect(screen.getByTestId('h3')).toBeInTheDocument();
  });
});
