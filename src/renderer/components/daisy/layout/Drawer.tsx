import React from 'react';

interface DrawerProps {
  id: string;
  side: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Drawer({
  id,
  side,
  children,
  className = '',
}: DrawerProps) {
  return (
    <div className={`drawer ${className}`.trim()}>
      <input id={id} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor={id} className="drawer-overlay" />
        {side}
      </div>
    </div>
  );
}
