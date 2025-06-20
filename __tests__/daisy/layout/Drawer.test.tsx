import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Drawer from '../../../src/renderer/components/daisy/layout/Drawer';

describe('Drawer', () => {
  it('renders variant overlay', () => {
    const { container } = render(
      <Drawer
        id="d1"
        side={<div>Side</div>}
        variant="accent"
        className="extra"
        data-testid="drawer"
      >
        <div>Content</div>
      </Drawer>
    );
    expect(container.querySelector('.drawer')).toBeInTheDocument();
    expect(container.querySelector('.drawer-content')).toBeInTheDocument();
    expect(container.querySelector('.drawer-side')).toBeInTheDocument();
    const wrapper = container.querySelector('.drawer');
    expect(wrapper).toHaveClass('extra');
    expect(wrapper).toHaveAttribute('data-testid', 'drawer');
    const overlay = container.querySelector('.drawer-overlay');
    expect(overlay).toHaveClass('bg-accent');
  });
});
