import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetSelectorInfoPanel from '../src/renderer/components/AssetSelectorInfoPanel';

describe('AssetSelectorInfoPanel', () => {
  it('shows placeholder when no asset', () => {
    render(<AssetSelectorInfoPanel asset={null} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('displays asset name', () => {
    render(<AssetSelectorInfoPanel asset="block/a.png" />);
    expect(screen.getByText('block/a.png')).toBeInTheDocument();
  });
});
