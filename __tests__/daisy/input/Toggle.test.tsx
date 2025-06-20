import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toggle } from '../../../src/renderer/components/daisy/input';

describe('Toggle', () => {
  it('renders variant and size', () => {
    render(<Toggle data-testid="tog" variant="info" size="xl" />);
    const el = screen.getByTestId('tog');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('toggle-info');
    expect(el).toHaveClass('toggle-xl');
  });
});
