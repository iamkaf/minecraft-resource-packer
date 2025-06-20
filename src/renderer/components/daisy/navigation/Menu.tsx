import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Menu({
  children,
  variant,
  size,
  className = '',
  ...rest
}: MenuProps) {
  return (
    <ul
      className={`menu ${variant ? `menu-${variant}` : ''} ${
        size ? `menu-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </ul>
  );
}
