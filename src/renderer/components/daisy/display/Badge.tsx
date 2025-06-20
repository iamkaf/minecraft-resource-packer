import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Badge({
  children,
  variant,
  size,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`badge ${variant ? `badge-${variant}` : ''} ${
        size ? `badge-${size}` : ''
      } ${className}`.trim()}
      data-testid="badge"
      {...rest}
    >
      {children}
    </span>
  );
}
