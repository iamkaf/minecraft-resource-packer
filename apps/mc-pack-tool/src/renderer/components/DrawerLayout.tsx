import React, { useEffect, useState } from 'react';

interface DrawerLayoutProps {
  children: React.ReactNode;
}

export default function DrawerLayout({ children }: DrawerLayoutProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
    setOpen(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={`drawer min-h-screen bg-base-200 ${open ? 'drawer-open' : ''}`}
    >
      <input
        id="nav-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={(e) => setOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col">{children}</div>
      <div className="drawer-side">
        {open && <label htmlFor="nav-drawer" className="drawer-overlay" />}
        <aside className={`menu p-4 bg-base-100 ${open ? 'w-60' : 'w-20'}`}>
          <ul>
            <li>
              <a className="flex items-center">
                <span className="text-xl">🏠</span>
                <span className={`ml-2 ${open ? '' : 'hidden md:inline'}`}>
                  Projects
                </span>
              </a>
            </li>
            <li>
              <a className="flex items-center">
                <span className="text-xl">⚙️</span>
                <span className={`ml-2 ${open ? '' : 'hidden md:inline'}`}>
                  Settings
                </span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
