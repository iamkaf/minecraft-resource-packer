import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetInfo from '../src/renderer/components/AssetInfo';

describe('AssetInfo', () => {
  it('shows placeholder when no asset', () => {
    render(<AssetInfo asset={null} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('renders asset name', () => {
    render(<AssetInfo asset="foo.png" />);
    expect(screen.getByText('foo.png')).toBeInTheDocument();
  });
});
