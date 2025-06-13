import { create } from 'zustand';

interface Action {
  undo: () => void;
  redo: () => void;
}

interface HistoryState {
  past: Action[];
  future: Action[];
  add: (action: Action) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  add: (action) =>
    set((state) => ({
      past: [...state.past.slice(-19), action],
      future: [],
      canUndo: true,
      canRedo: false,
    })),
  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;
    const action = past[past.length - 1];
    action.undo();
    set({
      past: past.slice(0, -1),
      future: [action, ...future].slice(0, 20),
      canUndo: past.length - 1 > 0,
      canRedo: true,
    });
  },
  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;
    const action = future[0];
    action.redo();
    set({
      past: [...past, action].slice(-20),
      future: future.slice(1),
      canUndo: true,
      canRedo: future.length - 1 > 0,
    });
  },
  canUndo: false,
  canRedo: false,
}));
