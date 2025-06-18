import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

import PackMetaModal from '../src/renderer/components/modals/PackMetaModal';
import type { PackMeta } from '../src/main/projects';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';

describe('JsonEditor integration', () => {
  it('saves metadata through the form', () => {
    const meta: PackMeta = {
      version: '1.21.1',
      description: '',
      author: '',
      urls: [],
      created: 0,
      license: '',
    };
    const onSave = vi.fn();
    render(
      <ToastProvider>
        <PackMetaModal
          project="Pack"
          meta={meta}
          onSave={onSave}
          onCancel={vi.fn()}
        />
      </ToastProvider>
    );
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'new' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'new' })
    );
  });
});
