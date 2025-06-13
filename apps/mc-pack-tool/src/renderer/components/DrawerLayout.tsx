import React from 'react';

interface DrawerLayoutProps {
  children: React.ReactNode;
}

export default function DrawerLayout({ children }: DrawerLayoutProps) {
  return (
    <div className="drawer drawer-mobile min-h-screen bg-base-200">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">{children}</div>
      <div className="drawer-side">
        <label htmlFor="nav-drawer" className="drawer-overlay" />
        <aside className="menu p-4 w-20 md:w-60 bg-base-100">
          <ul>
            <li>
              <a className="flex items-center">
                <span className="text-xl">🏠</span>
                <span className="hidden md:inline ml-2">Projects</span>
              </a>
            </li>
            <li>
              <a className="flex items-center">
                <span className="text-xl">⚙️</span>
                <span className="hidden md:inline ml-2">Settings</span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
