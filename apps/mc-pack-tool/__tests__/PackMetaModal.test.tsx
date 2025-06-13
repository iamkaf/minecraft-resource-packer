import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PackMetaModal from '../src/renderer/components/PackMetaModal';
import type { PackMeta } from '../src/main/projects';

describe('PackMetaModal', () => {
  it('submits edited metadata', () => {
    const meta: PackMeta = {
      description: 'desc',
      author: 'me',
      urls: ['https://a.com'],
      created: 0,
    };
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(<PackMetaModal meta={meta} onSave={onSave} onCancel={onCancel} />);
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'new' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'new' })
    );
  });
});
