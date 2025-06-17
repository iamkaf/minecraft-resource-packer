import React from 'react';
import { Link } from 'react-router-dom';
import { toggleTheme } from '../../utils/theme';
import { Button } from '../daisy/actions';

export default function Navbar() {
  return (
    <header className="navbar bg-primary text-primary-content">
      <div className="flex-1 px-2 font-display text-lg" data-testid="app-title">
        Minecraft Resource Packer
      </div>
      <nav className="flex gap-2 mr-2">
        <Link to="/" className="btn btn-ghost btn-sm">
          Projects
        </Link>
        <Link to="/settings" className="btn btn-ghost btn-sm">
          Settings
        </Link>
        <Link to="/about" className="btn btn-ghost btn-sm">
          About
        </Link>
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
