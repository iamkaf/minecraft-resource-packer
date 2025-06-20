import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AtlasViewer from '../src/renderer/components/assets/AtlasViewer';
import { SetPath, electronAPI } from './test-utils';

describe('AtlasViewer', () => {
  it('renders stitched atlas', async () => {
    electronAPI.createAtlas.mockResolvedValue('data:image/png;base64,abc');

    render(
      <SetPath path="/proj">
        <AtlasViewer textures={['a.png', 'b.png']} onClose={() => {}} />
      </SetPath>
    );

    expect(electronAPI.createAtlas).toHaveBeenCalledWith('/proj', [
      'a.png',
      'b.png',
    ]);

    const img = await screen.findByAltText('atlas');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc');
  });

  it('calls onClose', async () => {
    electronAPI.createAtlas.mockResolvedValue('data:image/png;base64,abc');
    const onClose = vi.fn();
    render(
      <SetPath path="/proj">
        <AtlasViewer textures={['a.png']} onClose={onClose} />
      </SetPath>
    );

    const btn = await screen.findByRole('button', { name: 'Close' });
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });
});
