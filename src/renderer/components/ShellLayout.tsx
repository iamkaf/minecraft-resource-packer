import React from 'react';
import Navbar from './Navbar';

export type View = 'projects' | 'settings' | 'about';

interface ShellLayoutProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (v: View) => void;
}

export default function ShellLayout({
  children,
  view,
  onNavigate,
}: ShellLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 bg-base-100 p-4" data-testid="shell-nav">
          <ul className="menu gap-1">
            <li>
              <a
                className={view === 'projects' ? 'active' : ''}
                onClick={() => onNavigate('projects')}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                className={view === 'settings' ? 'active' : ''}
                onClick={() => onNavigate('settings')}
              >
                Settings
              </a>
            </li>
            <li>
              <a
                className={view === 'about' ? 'active' : ''}
                onClick={() => onNavigate('about')}
              >
                About
              </a>
            </li>
          </ul>
        </aside>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
