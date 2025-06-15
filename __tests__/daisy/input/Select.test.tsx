import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from '../../../src/renderer/components/daisy/input';

describe('Select', () => {
  it('renders', () => {
    render(
      <Select data-testid="sel">
        <option>1</option>
      </Select>
    );
    expect(screen.getByTestId('sel')).toBeInTheDocument();
  });
});
