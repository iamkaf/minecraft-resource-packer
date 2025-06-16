import React from 'react';
import { toggleTheme } from '../utils/theme';
import { Button } from './daisy/actions';
import type { View } from './App';

interface Props {
  onNavigate: (v: View) => void;
}

export default function Navbar({ onNavigate }: Props) {
  return (
    <header className="navbar bg-primary text-primary-content">
      <div className="flex-1 px-2 font-display text-lg" data-testid="app-title">
        Minecraft Resource Packer
      </div>
      <nav className="flex gap-2 mr-2">
        <Button
          className="btn-ghost btn-sm"
          onClick={() => onNavigate('manager')}
        >
          Projects
        </Button>
        <Button
          className="btn-ghost btn-sm"
          onClick={() => onNavigate('settings')}
        >
          Settings
        </Button>
        <Button
          className="btn-ghost btn-sm"
          onClick={() => onNavigate('about')}
        >
          About
        </Button>
      </nav>
      <Button
        className="btn-square btn-ghost"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        🌓
      </Button>
    </header>
  );
}
