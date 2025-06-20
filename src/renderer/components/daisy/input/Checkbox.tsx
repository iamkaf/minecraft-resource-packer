import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Checkbox({
  variant,
  size,
  className = '',
  ...rest
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`checkbox ${variant ? `checkbox-${variant}` : ''} ${
        size ? `checkbox-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
