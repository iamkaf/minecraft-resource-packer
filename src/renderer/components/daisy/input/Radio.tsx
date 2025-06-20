import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Radio({
  variant,
  size,
  className = '',
  ...rest
}: RadioProps) {
  return (
    <input
      type="radio"
      className={`radio ${variant ? `radio-${variant}` : ''} ${
        size ? `radio-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
