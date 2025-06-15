import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputField } from '../../../src/renderer/components/daisy/input';

describe('InputField', () => {
  it('renders', () => {
    render(<InputField data-testid="inp" />);
    expect(screen.getByTestId('inp')).toBeInTheDocument();
  });
});
