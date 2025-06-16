import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { H1 } from '../../../src/renderer/components/daisy/typography';

describe('H1', () => {
  it('renders', () => {
    render(<H1>Title</H1>);
    expect(screen.getByTestId('h1')).toBeInTheDocument();
  });
});
