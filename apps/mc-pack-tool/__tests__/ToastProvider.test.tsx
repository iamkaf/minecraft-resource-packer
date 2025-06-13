import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastProvider, {
  useToast,
} from '../src/renderer/components/ToastProvider';

function TestComp() {
  const toast = useToast();
  return <button onClick={() => toast('hello')}>Show</button>;
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
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryAllByText('hello')).toHaveLength(0);
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
});
