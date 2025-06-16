import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from '../../../src/renderer/components/daisy/input';

describe('Textarea', () => {
  it('renders and accepts className', () => {
    render(<Textarea data-testid="ta" className="extra" />);
    const el = screen.getByTestId('ta');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
