import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from '../../../src/renderer/components/daisy/input';

describe('Select', () => {
  it('renders and accepts className', () => {
    render(
      <Select data-testid="sel" className="extra">
        <option>1</option>
      </Select>
    );
    const el = screen.getByTestId('sel');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
