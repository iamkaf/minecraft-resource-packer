import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dropdown from '../../../src/renderer/components/daisy/actions/Dropdown';

describe('daisy Dropdown', () => {
  it('renders dropdown and accepts props', () => {
    render(
      <Dropdown label="Menu" className="extra" data-testid="drop">
        <li>Item</li>
      </Dropdown>
    );
    const el = screen.getByTestId('drop');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
