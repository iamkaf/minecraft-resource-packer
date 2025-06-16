import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Blockquote } from '../../../src/renderer/components/daisy/typography';

describe('Blockquote', () => {
  it('renders', () => {
    render(<Blockquote>Quote</Blockquote>);
    expect(screen.getByTestId('blockquote')).toBeInTheDocument();
  });
});
