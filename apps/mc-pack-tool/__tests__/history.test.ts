import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHistoryStore } from '../src/renderer/store/history';

beforeEach(() => {
  useHistoryStore.setState({
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,
    add: useHistoryStore.getState().add,
    undo: useHistoryStore.getState().undo,
    redo: useHistoryStore.getState().redo,
  });
});

describe('history store', () => {
  it('limits queue to 20 actions', () => {
    for (let i = 0; i < 25; i++) {
      useHistoryStore.getState().add({
        undo: () => {
          /* noop */
        },
        redo: () => {
          /* noop */
        },
      });
    }
    expect(useHistoryStore.getState().past.length).toBe(20);
  });

  it('undo and redo invoke actions', () => {
    const undoFn = vi.fn();
    const redoFn = vi.fn();
    useHistoryStore.getState().add({ undo: undoFn, redo: redoFn });
    useHistoryStore.getState().undo();
    expect(undoFn).toHaveBeenCalled();
    useHistoryStore.getState().redo();
    expect(redoFn).toHaveBeenCalled();
  });
});
