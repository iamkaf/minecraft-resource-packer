import React from 'react';
import type { DaisyColor } from '../types';

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  side: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: DaisyColor;
}

export default function Drawer({
  id,
  side,
  children,
  variant,
  className = '',
  ...rest
}: DrawerProps) {
  return (
    <div className={`drawer ${className}`.trim()} {...rest}>
      <input id={id} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label
          htmlFor={id}
          className={`drawer-overlay ${
            variant ? `bg-${variant} bg-opacity-50` : ''
          }`.trim()}
        />
        {side}
      </div>
    </div>
  );
}
