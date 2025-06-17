import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import PackMetaModal from '../src/renderer/components/PackMetaModal';
import ToastProvider from '../src/renderer/components/ToastProvider';
import type { PackMeta } from '../src/main/projects';

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
  loader: { config: vi.fn() },
}));

describe('JsonEditor', () => {
  it('rejects invalid JSON', () => {
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
          onCancel={() => {}}
        />
      </ToastProvider>
    );
    fireEvent.change(screen.getByTestId('editor'), { target: { value: '{' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getAllByText('Invalid JSON')).toHaveLength(2);
  });
});
