import React, { createContext, useContext, useEffect, useState } from 'react';
import path from 'path';
import { useToast } from './ToastProvider';

export type EditorAction =
  | { type: 'add'; project: string; texture: string; dest: string }
  | { type: 'rename'; oldPath: string; newPath: string }
  | { type: 'delete'; path: string; data: string };

interface Context {
  addTexture: (project: string, texture: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  deleteFile: (file: string) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

const noop = async () => {
  /* noop */
};
const defaultValue: Context = {
  addTexture: noop,
  renameFile: noop,
  deleteFile: noop,
  undo: noop,
  redo: noop,
};
const UndoRedoContext = createContext<Context>(defaultValue);
export const useUndoRedo = () => useContext(UndoRedoContext);

export default function UndoRedoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useToast();
  const [undoStack, setUndoStack] = useState<EditorAction[]>([]);
  const [redoStack, setRedoStack] = useState<EditorAction[]>([]);

  const record = (action: EditorAction) => {
    setUndoStack((prev) => {
      const next = [...prev, action];
      return next.slice(-20);
    });
    setRedoStack([]);
  };

  const addTexture = async (project: string, texture: string) => {
    await window.electronAPI?.addTexture(project, texture);
    const dest = path.join(project, 'assets', 'minecraft', 'textures', texture);
    record({ type: 'add', project, texture, dest });
  };

  const renameFile = async (oldPath: string, newPath: string) => {
    await window.electronAPI?.renameFile(oldPath, newPath);
    record({ type: 'rename', oldPath, newPath });
  };

  const deleteFile = async (file: string) => {
    let data = '';
    try {
      data = await window.electronAPI?.readFile(file);
    } catch {
      /* ignore */
    }
    await window.electronAPI?.deleteFile(file);
    record({ type: 'delete', path: file, data });
  };

  const perform = async (action: EditorAction, forward: boolean) => {
    switch (action.type) {
      case 'add':
        if (forward) {
          await window.electronAPI?.addTexture(action.project, action.texture);
        } else {
          await window.electronAPI?.deleteFile(action.dest);
        }
        break;
      case 'rename':
        if (forward) {
          await window.electronAPI?.renameFile(action.oldPath, action.newPath);
        } else {
          await window.electronAPI?.renameFile(action.newPath, action.oldPath);
        }
        break;
      case 'delete':
        if (forward) {
          await window.electronAPI?.deleteFile(action.path);
        } else {
          await window.electronAPI?.writeFile(action.path, action.data);
        }
        break;
      default:
        break;
    }
  };

  const undo = async () => {
    if (undoStack.length === 0) {
      toast({ message: 'Nothing to undo', type: 'info' });
      return;
    }
    const last = undoStack[undoStack.length - 1];
    await perform(last, false);
    setUndoStack((u) => u.slice(0, -1));
    setRedoStack((r) => [...r, last]);
  };

  const redo = async () => {
    if (redoStack.length === 0) {
      toast({ message: 'Nothing to redo', type: 'info' });
      return;
    }
    const last = redoStack[redoStack.length - 1];
    await perform(last, true);
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((u) => [...u, last]);
  };

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [undoStack, redoStack]);

  return (
    <UndoRedoContext.Provider
      value={{ addTexture, renameFile, deleteFile, undo, redo }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}
