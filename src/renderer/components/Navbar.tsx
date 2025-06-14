import React from 'react';
import { toggleTheme } from '../utils/theme';

export default function Navbar() {
  return (
    <header className="navbar bg-primary text-primary-content">
      <div className="flex-1 px-2 font-display text-lg" data-testid="app-title">
        Minecraft Resource Packer
      </div>
      <button
        className="btn btn-square btn-ghost"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        🌓
      </button>
    </header>
  );
}
