import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../../../src/renderer/components/daisy/display/Avatar';

describe('Avatar', () => {
  it('renders and accepts className', () => {
    render(<Avatar src="a.png" className="extra" />);
    const el = screen.getByTestId('avatar');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('extra');
  });
});
