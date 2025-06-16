import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PreviewPane from '../src/renderer/components/PreviewPane';

describe('PreviewPane', () => {
  it('renders with texture', () => {
    render(<PreviewPane texture="foo.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'asset://foo.png');
  });

  it('applies neutral lighting by default', () => {
    render(<PreviewPane texture={null} />);
    const pane = screen.getByTestId('preview-pane');
    expect(pane.className).toContain('bg-gray-200');
  });

  it('supports no lighting option', () => {
    render(<PreviewPane texture={null} lighting="none" />);
    const pane = screen.getByTestId('preview-pane');
    expect(pane.className).not.toContain('bg-gray-200');
  });
});
