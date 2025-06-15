import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetSelectorInfoPanel from '../src/renderer/components/AssetSelectorInfoPanel';

describe('AssetSelectorInfoPanel', () => {
  it('shows placeholder when no asset', () => {
    render(<AssetSelectorInfoPanel projectPath="/p" asset={null} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('displays asset name', () => {
    render(<AssetSelectorInfoPanel projectPath="/p" asset="block/a.png" />);
    expect(screen.getByText('block/a.png')).toBeInTheDocument();
  });

  it('adds asset on button click', () => {
    const addTexture = vi.fn();
    interface API {
      addTexture: typeof addTexture;
    }
    (window as unknown as { electronAPI: API }).electronAPI = { addTexture };
    render(<AssetSelectorInfoPanel projectPath="/p" asset="block/a.png" />);
    screen.getByText('Add').click();
    expect(addTexture).toHaveBeenCalledWith('/p', 'block/a.png');
  });
});
