import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dropdown from '../../../src/renderer/components/daisy/actions/Dropdown';

describe('daisy Dropdown', () => {
  it('renders dropdown', () => {
    render(
      <Dropdown label="Menu">
        <li>Item</li>
      </Dropdown>
    );
    expect(screen.getByTestId('daisy-dropdown')).toBeInTheDocument();
  });
});
