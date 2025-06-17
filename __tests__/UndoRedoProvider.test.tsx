import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UndoRedoProvider, {
  useUndoRedo,
} from '../src/renderer/components/UndoRedoProvider';
import ToastProvider from '../src/renderer/components/ToastProvider';

function TestComp() {
  const { addTexture, renameFile, deleteFile, undo, redo } = useUndoRedo();
  return (
    <div>
      <button onClick={() => addTexture('/proj', 'a.png')}>add</button>
      <button onClick={() => renameFile('old.txt', 'new.txt')}>rename</button>
      <button onClick={() => deleteFile('del.txt')}>delete</button>
      <button onClick={undo}>undo</button>
      <button onClick={redo}>redo</button>
    </div>
  );
}

describe('UndoRedoProvider', () => {
  const addTexture = vi.fn();
  const renameFile = vi.fn();
  const deleteFile = vi.fn();
  const readFile = vi.fn(async () => 'data');
  const writeFile = vi.fn();

  beforeEach(() => {
    interface API {
      addTexture: typeof addTexture;
      renameFile: typeof renameFile;
      deleteFile: typeof deleteFile;
      readFile: typeof readFile;
      writeFile: typeof writeFile;
    }
    (window as unknown as { electronAPI: API }).electronAPI = {
      addTexture,
      renameFile,
      deleteFile,
      readFile,
      writeFile,
    };
    vi.clearAllMocks();
  });

  it('records add/undo/redo actions', async () => {
    render(
      <ToastProvider>
        <UndoRedoProvider>
          <TestComp />
        </UndoRedoProvider>
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('add'));
    expect(addTexture).toHaveBeenCalledWith('/proj', 'a.png');
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('undo'));
      await Promise.resolve();
    });
    expect(deleteFile).toHaveBeenCalledTimes(1);
    await act(async () => {
      fireEvent.click(screen.getByText('redo'));
      await Promise.resolve();
    });
    expect(addTexture).toHaveBeenCalledTimes(2);
  });

  it('handles rename undo/redo', async () => {
    render(
      <ToastProvider>
        <UndoRedoProvider>
          <TestComp />
        </UndoRedoProvider>
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('rename'));
    expect(renameFile).toHaveBeenCalledWith('old.txt', 'new.txt');
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('undo'));
      await Promise.resolve();
    });
    expect(renameFile).toHaveBeenCalledTimes(2);
  });

  it('binds hotkeys', async () => {
    render(
      <ToastProvider>
        <UndoRedoProvider>
          <TestComp />
        </UndoRedoProvider>
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('rename'));
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
      await Promise.resolve();
    });
    expect(renameFile).toHaveBeenCalledTimes(2);
  });
});
