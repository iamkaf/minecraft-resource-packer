import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from '../../../src/renderer/components/daisy/input';

describe('Textarea', () => {
  it('renders variant and size', () => {
    render(
      <Textarea
        data-testid="ta"
        variant="secondary"
        size="xs"
        className="extra"
      />
    );
    const el = screen.getByTestId('ta');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('textarea-secondary');
    expect(el).toHaveClass('textarea-xs');
    expect(el).toHaveClass('extra');
  });
});
