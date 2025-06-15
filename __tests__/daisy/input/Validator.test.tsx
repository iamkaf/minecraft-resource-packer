import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Validator,
  InputField,
} from '../../../src/renderer/components/daisy/input';

describe('Validator', () => {
  it('renders with hint', () => {
    render(
      <Validator hint="error" data-testid="val">
        <InputField required />
      </Validator>
    );
    expect(screen.getByTestId('val')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });
});
