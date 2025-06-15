import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Calendar } from '../../../src/renderer/components/daisy/input';

describe('Calendar', () => {
  it('renders', () => {
    render(<Calendar data-testid="cal" />);
    expect(screen.getByTestId('cal')).toBeInTheDocument();
  });
});
