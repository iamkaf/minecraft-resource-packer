import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Toggle({
  variant,
  size,
  className = '',
  ...rest
}: ToggleProps) {
  return (
    <input
      type="checkbox"
      className={`toggle ${variant ? `toggle-${variant}` : ''} ${
        size ? `toggle-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
