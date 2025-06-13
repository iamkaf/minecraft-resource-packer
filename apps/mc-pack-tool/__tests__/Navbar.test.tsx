import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Navbar from '../src/renderer/components/Navbar';
import { useHistoryStore } from '../src/renderer/store/history';

// Ensure consistent DOM for each test
beforeEach(() => {
  document.body.innerHTML = '';
  document.documentElement.setAttribute('data-theme', 'minecraft');
  localStorage.clear();
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

describe('Navbar', () => {
  it('displays app title', () => {
    render(<Navbar />);
    expect(screen.getByTestId('app-title')).toHaveTextContent(
      'Minecraft Resource Packer'
    );
  });

  it('toggles theme and saves preference', () => {
    render(<Navbar />);
    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('shows disabled undo/redo with empty history', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Undo')).toBeDisabled();
    expect(screen.getByLabelText('Redo')).toBeDisabled();
  });

  it('triggers undo and redo actions', () => {
    const undoFn = vi.fn();
    const redoFn = vi.fn();
    useHistoryStore.getState().add({ undo: undoFn, redo: redoFn });
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText('Undo'));
    expect(undoFn).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Redo'));
    expect(redoFn).toHaveBeenCalled();
  });
});
