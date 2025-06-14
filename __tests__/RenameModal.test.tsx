import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RenameModal from '../src/renderer/components/RenameModal';

describe('RenameModal', () => {
  it('submits new name', () => {
    const cb = vi.fn();
    render(
      <RenameModal current="a.txt" onCancel={() => undefined} onRename={cb} />
    );
    const input = screen.getByDisplayValue('a.txt') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'b.txt' } });
    const form = input.closest('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    expect(cb).toHaveBeenCalledWith('b.txt');
  });

  it('calls onCancel when cancel clicked', () => {
    const cancel = vi.fn();
    render(
      <RenameModal
        current="a.txt"
        onCancel={cancel}
        onRename={() => undefined}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(cancel).toHaveBeenCalled();
  });
});
