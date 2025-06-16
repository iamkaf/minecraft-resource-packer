import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { H2 } from '../../../src/renderer/components/daisy/typography';

describe('H2', () => {
  it('renders', () => {
    render(<H2>Subtitle</H2>);
    expect(screen.getByTestId('h2')).toBeInTheDocument();
  });
});
