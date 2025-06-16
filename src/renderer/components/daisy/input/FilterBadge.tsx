import React from 'react';

export interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  selected?: boolean;
}

export default function FilterBadge({
  label,
  selected = false,
  className = '',
  ...rest
}: FilterBadgeProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={`badge badge-outline cursor-pointer select-none ${
        selected ? 'badge-primary' : ''
      } ${className}`.trim()}
      {...rest}
    >
      {label}
    </span>
  );
}
