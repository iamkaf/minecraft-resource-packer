import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AssetInfoPane from '../src/renderer/components/AssetInfoPane';

describe('AssetInfoPane', () => {
  it('shows placeholder when nothing selected', () => {
    render(<AssetInfoPane selected={[]} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('lists selected files and preview', () => {
    render(<AssetInfoPane selected={['a.png', 'b.txt']} />);
    expect(screen.getByText('a.png')).toBeInTheDocument();
    expect(screen.getByAltText('a.png')).toBeInTheDocument();
  });
});
