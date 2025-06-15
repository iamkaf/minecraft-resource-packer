import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toggle } from '../../../src/renderer/components/daisy/input';

describe('Toggle', () => {
  it('renders', () => {
    render(<Toggle data-testid="tog" />);
    expect(screen.getByTestId('tog')).toBeInTheDocument();
  });
});
