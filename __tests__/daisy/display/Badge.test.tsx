import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../../../src/renderer/components/daisy/display/Badge';

describe('Badge', () => {
  it('renders and accepts props', () => {
    render(
      <Badge variant="accent" size="lg" id="b1" className="extra">
        Hi
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-accent');
    expect(badge).toHaveClass('badge-lg');
    expect(badge).toHaveClass('extra');
    expect(badge).toHaveAttribute('id', 'b1');
  });
});
