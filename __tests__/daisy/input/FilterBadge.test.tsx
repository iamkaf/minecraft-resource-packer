import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterBadge } from '../../../src/renderer/components/daisy/input';

describe('FilterBadge', () => {
  it('renders label and selected class', () => {
    render(<FilterBadge label="Test" selected />);
    const badge = screen.getByRole('button', { name: 'Test' });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-primary');
  });
});
