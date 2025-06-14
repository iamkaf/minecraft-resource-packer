import React from 'react';
import { toggleTheme } from '../utils/theme';

export type View = 'projects' | 'settings' | 'about';

interface DesktopLayoutProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (v: View) => void;
}

export default function DesktopLayout({
  children,
  view,
  onNavigate,
}: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-48 bg-base-100 p-4 flex flex-col gap-2">
        <h1 className="font-display text-lg" data-testid="sidebar-title">
          Minecraft Resource Packer
        </h1>
        <nav className="flex-1">
          <ul className="menu">
            <li>
              <button
                className={view === 'projects' ? 'active' : ''}
                onClick={() => onNavigate('projects')}
              >
                Projects
              </button>
            </li>
            <li>
              <button
                className={view === 'settings' ? 'active' : ''}
                onClick={() => onNavigate('settings')}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                className={view === 'about' ? 'active' : ''}
                onClick={() => onNavigate('about')}
              >
                About
              </button>
            </li>
          </ul>
        </nav>
        <button
          className="btn btn-square btn-ghost mt-auto"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          🌓
        </button>
      </aside>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
