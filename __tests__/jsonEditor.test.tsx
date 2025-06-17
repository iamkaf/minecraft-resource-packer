import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));
vi.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import PackMetaModal from '../src/renderer/components/PackMetaModal';
import type { PackMeta } from '../src/main/projects';
import ToastProvider from '../src/renderer/components/ToastProvider';

describe('JsonEditor integration', () => {
  it('rejects invalid JSON', () => {
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
    fireEvent.change(screen.getByTestId('editor'), { target: { value: '{' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getAllByText('Invalid metadata').length).toBeGreaterThan(0);
  });
});
