import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../../../src/renderer/components/daisy/display/Card';

describe('Card', () => {
  it('renders and accepts props', () => {
    render(
      <Card title="Title" className="extra" id="c1">
        Body
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('extra');
    expect(card).toHaveAttribute('id', 'c1');
  });
});
