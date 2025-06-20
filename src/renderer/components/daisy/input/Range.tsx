import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface RangeProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Range({
  className = '',
  variant,
  size,
  ...rest
}: RangeProps) {
  return (
    <input
      type="range"
      className={`range ${variant ? `range-${variant}` : ''} ${
        size ? `range-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
