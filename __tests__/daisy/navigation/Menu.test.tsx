import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Menu } from '../../../src/renderer/components/daisy/navigation';

describe('Menu', () => {
  it('renders variant and size', () => {
    const { container } = render(
      <Menu variant="accent" size="lg">
        <li>Item</li>
      </Menu>
    );
    expect(container.firstChild).toHaveClass('menu');
    expect(container.firstChild).toHaveClass('menu-accent');
    expect(container.firstChild).toHaveClass('menu-lg');
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});
