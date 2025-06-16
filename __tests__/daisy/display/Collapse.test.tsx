import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Collapse from '../../../src/renderer/components/daisy/display/Collapse';

describe('Collapse', () => {
  it('renders and accepts props', () => {
    render(
      <Collapse title="Title" className="extra" defaultOpen>
        Content
      </Collapse>
    );
    const col = screen.getByTestId('collapse');
    expect(col).toBeInTheDocument();
    expect(col).toHaveClass('extra');
    const checkbox = col.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
