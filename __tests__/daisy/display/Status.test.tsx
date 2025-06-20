import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Status from '../../../src/renderer/components/daisy/display/Status';

describe('Status', () => {
  it('renders and accepts props', () => {
    render(<Status id="st1" className="extra" />);
    const el = screen.getByTestId('status');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'st1');
  });
});
