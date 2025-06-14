import React from 'react';

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
    <div className="flex h-screen bg-base-200">
      <aside className="w-48 bg-base-100 p-4">
        <ul className="menu">
          <li>
            <a
              className={view === 'projects' ? 'active' : ''}
              onClick={() => onNavigate('projects')}
            >
              🏠 <span className="ml-2">Projects</span>
            </a>
          </li>
          <li>
            <a
              className={view === 'settings' ? 'active' : ''}
              onClick={() => onNavigate('settings')}
            >
              ⚙️ <span className="ml-2">Settings</span>
            </a>
          </li>
          <li>
            <a
              className={view === 'about' ? 'active' : ''}
              onClick={() => onNavigate('about')}
            >
              ℹ️ <span className="ml-2">About</span>
            </a>
          </li>
        </ul>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
