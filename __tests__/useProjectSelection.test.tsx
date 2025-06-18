import { renderHook, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useProjectSelection from '../src/renderer/hooks/useProjectSelection';

describe('useProjectSelection', () => {
  it('tracks selection state', () => {
    const { result } = renderHook(() => useProjectSelection(vi.fn(), vi.fn()));
    act(() => {
      result.current.toggleOne('A', true);
    });
    expect(result.current.selected.has('A')).toBe(true);
    act(() => {
      result.current.toggleAll(['A', 'B'], true);
    });
    expect(result.current.selected.has('B')).toBe(true);
    act(() => {
      result.current.clear();
    });
    expect(result.current.selected.size).toBe(0);
  });

  it('invokes callbacks via hotkeys', () => {
    const open = vi.fn();
    const del = vi.fn();
    const { result } = renderHook(() => useProjectSelection(open, del));
    act(() => result.current.toggleOne('A', true));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(open).toHaveBeenCalled();
    expect(open.mock.calls[0][0]).toBe('A');
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(del).toHaveBeenCalledWith(['A']);
  });
});
