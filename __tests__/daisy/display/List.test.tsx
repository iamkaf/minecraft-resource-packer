import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import List from '../../../src/renderer/components/daisy/display/List';

describe('List', () => {
  it('renders', () => {
    render(
      <List>
        <li>Item</li>
      </List>
    );
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });
});
