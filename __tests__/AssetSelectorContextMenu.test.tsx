import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetSelectorContextMenu from '../src/renderer/components/assets/AssetSelectorContextMenu';

describe('AssetSelectorContextMenu', () => {
  it('fires callbacks and renders to overlay root', () => {
    const add = vi.fn();
    const reveal = vi.fn();
    render(
      <AssetSelectorContextMenu
        asset="grass.png"
        onAdd={add}
        onReveal={reveal}
      />
    );
    const root = document.getElementById('overlay-root');
    expect(root?.querySelector('ul')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add to Project' }));
    expect(add).toHaveBeenCalledWith('grass.png');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reveal' }));
    expect(reveal).toHaveBeenCalledWith('grass.png');
  });
});
