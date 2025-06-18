import React from 'react';
import type { DaisyColor } from '../types';
export default function Badge({
  children,
  variant,
  className = '',
}: {
  children: React.ReactNode;
  variant?: DaisyColor;
  className?: string;
}) {
  return (
    <span
      className={`badge ${variant ? `badge-${variant}` : ''} ${className}`.trim()}
      data-testid="badge"
    >
      {children}
    </span>
  );
}
