import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchToolbar from '../src/renderer/components/project/SearchToolbar';

describe('SearchToolbar', () => {
  it('handles search input change', () => {
    const cb = vi.fn();
    render(
      <SearchToolbar
        search=""
        onSearchChange={cb}
        versions={[]}
        activeVersion={null}
        onToggleVersion={() => {}}
        onBulkExport={() => {}}
        disableExport={false}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'pack' },
    });
    expect(cb).toHaveBeenCalledWith('pack');
  });

  it('toggles version chips and handles export', () => {
    const toggle = vi.fn();
    const bulk = vi.fn();
    const { rerender } = render(
      <SearchToolbar
        search=""
        onSearchChange={() => {}}
        versions={['1.20']}
        activeVersion="1.20"
        onToggleVersion={toggle}
        onBulkExport={bulk}
        disableExport={true}
      />
    );
    const chip = screen.getByRole('button', { name: '1.20' });
    expect(chip).toHaveClass('badge-primary');
    fireEvent.click(chip);
    expect(toggle).toHaveBeenCalledWith('1.20');
    const btn = screen.getByRole('button', { name: 'Bulk Export' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(bulk).not.toHaveBeenCalled();

    rerender(
      <SearchToolbar
        search=""
        onSearchChange={() => {}}
        versions={['1.20']}
        activeVersion={null}
        onToggleVersion={toggle}
        onBulkExport={bulk}
        disableExport={false}
      />
    );
    expect(screen.getByRole('button', { name: '1.20' })).not.toHaveClass(
      'badge-primary'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bulk Export' }));
    expect(bulk).toHaveBeenCalled();
  });

  it('input has width class', () => {
    render(
      <SearchToolbar
        search=""
        onSearchChange={() => {}}
        versions={[]}
        activeVersion={null}
        onToggleVersion={() => {}}
        onBulkExport={() => {}}
        disableExport={false}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('w-40');
  });
});
