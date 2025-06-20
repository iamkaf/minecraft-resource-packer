import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Dropdown({
  label,
  children,
  className = '',
  variant,
  size,
  ...rest
}: DropdownProps) {
  return (
    <div
      className={`dropdown ${className}`.trim()}
      data-testid="daisy-dropdown"
      {...rest}
    >
      <div
        tabIndex={0}
        role="button"
        className={`btn m-1 ${variant ? `btn-${variant}` : ''} ${
          size ? `btn-${size}` : ''
        }`.trim()}
      >
        {label}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {children}
      </ul>
    </div>
  );
}
