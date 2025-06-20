import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from '../../../src/renderer/components/daisy/input';

describe('Select', () => {
  it('renders variant and size', () => {
    render(
      <Select data-testid="sel" variant="primary" size="sm" className="extra">
        <option>1</option>
      </Select>
    );
    const el = screen.getByTestId('sel');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('select-primary');
    expect(el).toHaveClass('select-sm');
    expect(el).toHaveClass('extra');
  });
});
