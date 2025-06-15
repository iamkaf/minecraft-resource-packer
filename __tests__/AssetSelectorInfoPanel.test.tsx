import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetSelectorInfoPanel from '../src/renderer/components/AssetSelectorInfoPanel';

describe('AssetSelectorInfoPanel', () => {
  it('shows placeholder when no asset', () => {
    render(<AssetSelectorInfoPanel projectPath="/proj" asset={null} />);
    expect(screen.getByText('No asset selected')).toBeInTheDocument();
  });

  it('displays asset name and adds on click', () => {
    const addTexture = vi.fn();
    interface API {
      addTexture: (p: string, n: string) => void;
    }
    (window as unknown as { electronAPI: API }).electronAPI = { addTexture };
    render(<AssetSelectorInfoPanel projectPath="/proj" asset="block/a.png" />);
    expect(screen.getByText('block/a.png')).toBeInTheDocument();
    screen.getByText('Add to Project').click();
    expect(addTexture).toHaveBeenCalledWith('/proj', 'block/a.png');
  });
});
