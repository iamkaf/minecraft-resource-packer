import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputField } from '../../../src/renderer/components/daisy/input';

describe('InputField', () => {
  it('renders variant and size', () => {
    render(
      <InputField
        data-testid="inp"
        variant="accent"
        size="lg"
        className="extra"
      />
    );
    const el = screen.getByTestId('inp');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('input-accent');
    expect(el).toHaveClass('input-lg');
    expect(el).toHaveClass('extra');
  });
});
