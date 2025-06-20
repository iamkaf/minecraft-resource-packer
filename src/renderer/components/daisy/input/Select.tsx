import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Select({
  children,
  className = '',
  variant,
  size,
  ...rest
}: SelectProps) {
  return (
    <select
      className={`select ${variant ? `select-${variant}` : ''} ${
        size ? `select-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </select>
  );
}
