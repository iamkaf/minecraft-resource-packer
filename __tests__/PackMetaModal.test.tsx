import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import os from 'os';
import { fireEvent, render, screen } from '@testing-library/react';
import path from 'path';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir() } }));
import PackMetaModal from '../src/renderer/components/modals/PackMetaModal';
import type { PackMeta } from '../src/main/projects';

describe('PackMetaModal', () => {
  it('submits edited metadata', () => {
    const meta: PackMeta = {
      version: '1.21.1',
      description: 'desc',
      author: 'me',
      urls: ['https://a.com'],
      created: 0,
      license: '',
    };
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <PackMetaModal
        project="Pack"
        meta={meta}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'new' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'new' })
    );
  });

  it('randomizes icon', () => {
    const meta: PackMeta = {
      version: '1.21.1',
      description: '',
      author: '',
      urls: [],
      created: 0,
      license: '',
    };
    const randomize = vi.fn();
    (
      window as unknown as { electronAPI: { randomizeIcon: typeof randomize } }
    ).electronAPI = {
      randomizeIcon: randomize,
    } as never;
    render(
      <PackMetaModal
        project="Pack"
        meta={meta}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Randomize Icon'));
    expect(randomize).toHaveBeenCalledWith(
      path.join(os.tmpdir(), 'projects', 'Pack')
    );
  });

  it('handles Escape and Enter', () => {
    const meta: PackMeta = {
      version: '1.21.1',
      description: '',
      author: '',
      urls: [],
      created: 0,
      license: '',
    };
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <PackMetaModal
        project="Pack"
        meta={meta}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    const dialog = screen.getByTestId('daisy-modal');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onSave).toHaveBeenCalled();
  });
});
