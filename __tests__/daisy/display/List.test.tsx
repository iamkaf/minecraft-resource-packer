import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import List from '../../../src/renderer/components/daisy/display/List';

describe('List', () => {
  it('renders and accepts props', () => {
    render(
      <List className="extra" id="l1">
        <li>Item</li>
      </List>
    );
    const el = screen.getByTestId('list');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'l1');
  });
});
