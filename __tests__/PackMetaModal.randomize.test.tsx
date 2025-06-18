import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import path from 'path';
import PackMetaModal from '../src/renderer/components/modals/PackMetaModal';
import type { PackMeta } from '../src/main/projects';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('PackMetaModal randomize regression', () => {
  it('sends absolute path to randomizeIcon', () => {
    const meta: PackMeta = {
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
      path.join('/tmp', 'projects', 'Pack')
    );
  });
});
