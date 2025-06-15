import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Drawer from '../../../src/renderer/components/daisy/layout/Drawer';

describe('Drawer', () => {
  it('renders drawer structure', () => {
    const { container } = render(
      <Drawer id="d1" side={<div>Side</div>}>
        <div>Content</div>
      </Drawer>
    );
    expect(container.querySelector('.drawer')).toBeInTheDocument();
    expect(container.querySelector('.drawer-content')).toBeInTheDocument();
    expect(container.querySelector('.drawer-side')).toBeInTheDocument();
  });
});
