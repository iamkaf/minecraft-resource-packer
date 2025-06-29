import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import TextureLab from '../src/renderer/components/assets/TextureLab';
import { SetPath, electronAPI } from './test-utils';

describe('TextureLab', () => {
  it('renders modal with controls', () => {
    let changed:
      | ((e: unknown, args: { path: string; stamp: number }) => void)
      | undefined;
    electronAPI.onFileChanged.mockImplementation((cb) => {
      changed = cb;
    });

    render(
      <SetPath path="/proj">
        <TextureLab file="/proj/foo.png" onClose={() => {}} />
      </SetPath>
    );
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
    const img = screen.getByAltText('preview') as HTMLImageElement;
    expect(img).toHaveAttribute('src', 'asset://foo.png');
    act(() => {
      changed?.({}, { path: 'foo.png', stamp: 1 });
    });
    expect(img.src).toContain('t=1');
  });

  it('cleans up listener on unmount', () => {
    const off = vi.fn();
    electronAPI.onFileChanged.mockReturnValue(off);

    const { unmount } = render(
      <SetPath path="/proj">
        <TextureLab file="/proj/foo.png" onClose={() => {}} />
      </SetPath>
    );
    unmount();
    expect(off).toHaveBeenCalled();
  });
});
