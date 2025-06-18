import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastProvider, {
  useToast,
} from '../src/renderer/components/providers/ToastProvider';

function TestComp() {
  const toast = useToast();
  return (
    <button onClick={() => toast({ message: 'hello', closable: true })}>
      Show
    </button>
  );
}

describe('ToastProvider', () => {
  it('shows toast messages and removes them after timeout', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <TestComp />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getAllByText('hello')).toHaveLength(2);
    const overlay = document.getElementById('overlay-root');
    expect(overlay?.textContent).toContain('hello');
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryAllByText('hello')).toHaveLength(0);
  });

  it('allows closing a toast manually', () => {
    render(
      <ToastProvider>
        <TestComp />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Show'));
    const btn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(btn);
    expect(screen.queryByText('hello')).toBeNull();
  });

  it('respects custom duration', () => {
    vi.useFakeTimers();
    function ShortToast() {
      const toast = useToast();
      return (
        <button onClick={() => toast({ message: 'short', duration: 1000 })}>
          Short
        </button>
      );
    }
    render(
      <ToastProvider>
        <ShortToast />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Short'));
    expect(screen.getAllByText('short')).toHaveLength(2);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryAllByText('short')).toHaveLength(0);
  });

  it('provides aria live region', () => {
    render(
      <ToastProvider>
        <div>child</div>
      </ToastProvider>
    );
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('clears timeouts on unmount', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <ToastProvider>
        <TestComp />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('Show'));
    unmount();
    expect(spy).toHaveBeenCalled();
  });
});
