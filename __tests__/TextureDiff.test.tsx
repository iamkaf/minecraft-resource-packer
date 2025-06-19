import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextureDiff from '../src/renderer/components/assets/TextureDiff';
import { SetPath, electronAPI } from './test-utils';

describe('TextureDiff', () => {
  it('renders vanilla comparison', async () => {
    electronAPI.getTextureUrl.mockResolvedValue('vanilla://foo.png');

    render(
      <SetPath path="/proj">
        <TextureDiff asset="block/a.png" onClose={() => undefined} />
      </SetPath>
    );

    expect(electronAPI.getTextureUrl).toHaveBeenCalledWith(
      '/proj',
      'block/a.png'
    );
    expect(await screen.findByTestId('diff')).toBeInTheDocument();
    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('src', 'vanilla://foo.png');
    expect(imgs[1]).toHaveAttribute('src', 'asset://block/a.png');
  });

  it('calls onClose', async () => {
    const onClose = vi.fn();
    electronAPI.getTextureUrl.mockResolvedValue('vanilla://foo.png');

    render(
      <SetPath path="/proj">
        <TextureDiff asset="block/a.png" onClose={onClose} />
      </SetPath>
    );

    const btn = await screen.findByRole('button', { name: 'Close' });
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });
});
