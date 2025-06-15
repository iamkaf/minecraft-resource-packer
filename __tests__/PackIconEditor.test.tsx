import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PackIconEditor from '../src/renderer/components/PackIconEditor';

describe('PackIconEditor', () => {
  it('randomises icon on button click', () => {
    const randomise = vi.fn();
    (
      window as unknown as {
        electronAPI: {
          randomizeIcon: typeof randomise;
          savePackIcon: () => Promise<void>;
        };
      }
    ).electronAPI = {
      randomizeIcon: randomise,
      savePackIcon: vi.fn(),
    } as never;
    render(<PackIconEditor project="/tmp/proj" onClose={() => undefined} />);
    fireEvent.click(screen.getByText('Randomise'));
    expect(randomise).toHaveBeenCalledWith('/tmp/proj');
  });

  it('saves uploaded file with border colour', () => {
    const save = vi.fn().mockResolvedValue(undefined);
    (
      window as unknown as {
        electronAPI: { randomizeIcon: () => void; savePackIcon: typeof save };
      }
    ).electronAPI = {
      randomizeIcon: vi.fn(),
      savePackIcon: save,
    } as never;
    render(<PackIconEditor project="/tmp/proj" onClose={() => undefined} />);
    const file = new File(['a'], 'icon.png', { type: 'image/png' });
    Object.defineProperty(file, 'path', { value: '/tmp/icon.png' });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    });
    fireEvent.change(screen.getByTestId('border-input'), {
      target: { value: '#ff00ff' },
    });
    const form = screen
      .getByTestId('file-input')
      .closest('form') as HTMLFormElement;
    fireEvent.submit(form);
    expect(save).toHaveBeenCalledWith('/tmp/proj', '/tmp/icon.png', '#ff00ff');
  });
});
