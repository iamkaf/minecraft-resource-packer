import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Paragraph } from '../../../src/renderer/components/daisy/typography';

describe('Paragraph', () => {
  it('renders variant and size', () => {
    render(
      <Paragraph variant="accent" size="lg" className="extra">
        Text
      </Paragraph>
    );
    const el = screen.getByTestId('paragraph');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('text-accent');
    expect(el).toHaveClass('text-lg');
    expect(el).toHaveClass('extra');
  });
});
