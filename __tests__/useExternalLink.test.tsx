import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ExternalLink from '../src/renderer/components/ExternalLink';
import ToastProvider from '../src/renderer/components/ToastProvider';

vi.useFakeTimers();
// eslint-disable-next-line no-var
var openExternal: ReturnType<typeof vi.fn>;
vi.mock('electron', () => ({
  shell: { openExternal: (openExternal = vi.fn()) },
}));

beforeEach(() => {
  openExternal.mockResolvedValue(undefined);
});

describe('useExternalLink', () => {
  it('shows toast on failure', async () => {
    openExternal.mockRejectedValueOnce(new Error('fail'));
    render(
      <ToastProvider>
        <ExternalLink href="https://example.com">Link</ExternalLink>
      </ToastProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Link'));
    });
    expect(screen.getAllByText('Failed to open link')).toHaveLength(2);
  });
});
