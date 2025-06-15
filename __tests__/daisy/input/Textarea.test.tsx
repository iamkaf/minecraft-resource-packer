import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from '../../../src/renderer/components/daisy/input';

describe('Textarea', () => {
  it('renders', () => {
    render(<Textarea data-testid="ta" />);
    expect(screen.getByTestId('ta')).toBeInTheDocument();
  });
});
