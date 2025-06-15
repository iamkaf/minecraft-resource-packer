import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PackIconEditor from '../src/renderer/components/PackIconEditor';

describe('PackIconEditor', () => {
  it('saves uploaded icon', async () => {
    const setIcon = vi.fn();
    Object.assign(window, {
      electronAPI: { setPackIcon: setIcon, randomizeIcon: vi.fn() },
    });
    render(<PackIconEditor project="Pack" onClose={() => undefined} />);
    const file = new File([new Uint8Array([1, 2])], 'icon.png', { type: 'image/png' });
    Object.defineProperty(file, 'arrayBuffer', {
      value: () => Promise.resolve(new Uint8Array([1, 2]).buffer),
    });
    const input = screen.getByLabelText('Upload PNG');
    await fireEvent.change(input, { target: { files: [file] } });
    const form = screen.getByTestId('icon-form');
    await fireEvent.submit(form);
    expect(setIcon).toHaveBeenCalled();
  });

  it('randomizes icon', () => {
    const randomize = vi.fn();
    Object.assign(window, {
      electronAPI: { setPackIcon: vi.fn(), randomizeIcon: randomize },
    });
    render(<PackIconEditor project="Pack" onClose={() => undefined} />);
    fireEvent.click(screen.getByText('Randomise Item'));
    expect(randomize).toHaveBeenCalledWith('Pack', '#000000');
  });
});
