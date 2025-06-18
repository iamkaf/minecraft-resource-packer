import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../../../src/renderer/components/daisy/display/Badge';

describe('Badge', () => {
  it('renders', () => {
    render(<Badge variant="accent">Hi</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-accent');
  });
});
