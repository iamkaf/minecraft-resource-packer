import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Diff from '../../../src/renderer/components/daisy/display/Diff';

describe('Diff', () => {
  it('renders and accepts props', () => {
    render(<Diff before="a" after="b" className="extra" id="d1" />);
    const el = screen.getByTestId('diff');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'd1');
  });
});
