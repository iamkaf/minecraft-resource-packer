import React from 'react';
import type { DaisyColor } from '../types';

export interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  selected?: boolean;
  variant?: DaisyColor;
}

export default function FilterBadge({
  label,
  selected = false,
  variant = 'primary',
  className = '',
  ...rest
}: FilterBadgeProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={`badge badge-outline cursor-pointer select-none ${
        selected ? `badge-${variant}` : ''
      } ${className}`.trim()}
      {...rest}
    >
      {label}
    </span>
  );
}
