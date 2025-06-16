import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PackMetaModal from '../src/renderer/components/PackMetaModal';
import ToastProvider from '../src/renderer/components/ToastProvider';
import type { PackMeta } from '../src/main/projects';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));

describe('PackMetaModal JSON validation', () => {
  it('rejects invalid json', () => {
    const meta: PackMeta = {
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
    const box = screen.getByRole('textbox');
    fireEvent.change(box, { target: { value: '{' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getAllByText('Invalid metadata')).toHaveLength(2);
  });
});
