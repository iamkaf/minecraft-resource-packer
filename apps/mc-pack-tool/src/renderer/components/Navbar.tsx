import React from 'react';
import { toggleTheme } from '../utils/theme';
import { useHistoryStore } from '../store/history';

export default function Navbar() {
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  return (
    <header className="navbar bg-primary text-primary-content">
      <div className="flex-1 px-2 font-display text-lg" data-testid="app-title">
        <span className="hidden sm:inline">Minecraft Resource Packer</span>
        <span className="sm:hidden">MRP</span>
      </div>
      <label
        htmlFor="nav-drawer"
        className="btn btn-square btn-ghost md:hidden"
        aria-label="Open menu"
        data-testid="drawer-toggle"
      >
        ☰
      </label>
      <button
        className="btn btn-square btn-ghost"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        🌓
      </button>
      <button
        className="btn btn-square btn-ghost"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        ↺
      </button>
      <button
        className="btn btn-square btn-ghost"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
      >
        ↻
      </button>
    </header>
  );
}
