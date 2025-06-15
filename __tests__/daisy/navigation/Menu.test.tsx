import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Menu } from '../../../src/renderer/components/daisy/navigation';

describe('Menu', () => {
  it('renders menu list', () => {
    const { container } = render(
      <Menu>
        <li>Item</li>
      </Menu>
    );
    expect(container.firstChild).toHaveClass('menu');
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});
