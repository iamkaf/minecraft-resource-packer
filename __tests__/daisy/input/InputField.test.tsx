import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputField } from '../../../src/renderer/components/daisy/input';

describe('InputField', () => {
  it('renders and accepts className', () => {
    render(<InputField data-testid="inp" className="extra" />);
    const el = screen.getByTestId('inp');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
