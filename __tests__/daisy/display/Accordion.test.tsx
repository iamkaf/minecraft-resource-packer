import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Accordion from '../../../src/renderer/components/daisy/display/Accordion';

describe('Accordion', () => {
  it('renders and accepts props', () => {
    render(
      <Accordion title="Title" className="extra" defaultOpen>
        Content
      </Accordion>
    );
    const acc = screen.getByTestId('accordion');
    expect(acc).toBeInTheDocument();
    expect(acc).toHaveClass('extra');
    const checkbox = acc.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
