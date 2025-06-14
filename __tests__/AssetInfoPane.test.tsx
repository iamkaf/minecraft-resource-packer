import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AssetInfoPane from '../src/renderer/components/AssetInfoPane';

describe('AssetInfoPane', () => {
  it('shows placeholder when nothing selected', () => {
    render(<AssetInfoPane selection={[]} />);
    expect(screen.getByText(/no asset/i)).toBeInTheDocument();
  });

  it('shows count for multi-selection', () => {
    render(<AssetInfoPane selection={['a', 'b']} />);
    expect(screen.getByText('2 assets selected')).toBeInTheDocument();
  });

  it('shows file name when single selected', () => {
    render(<AssetInfoPane selection={['foo.png']} />);
    expect(screen.getByText('foo.png')).toBeInTheDocument();
  });
});
