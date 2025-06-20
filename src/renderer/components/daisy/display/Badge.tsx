import React from 'react';
import type { DaisyColor } from '../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: DaisyColor;
}

export default function Badge({
  children,
  variant,
  className = '',
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`badge ${variant ? `badge-${variant}` : ''} ${className}`.trim()}
      data-testid="badge"
      {...rest}
    >
      {children}
    </span>
  );
}
