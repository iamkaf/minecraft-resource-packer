import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function FileInput({
  variant,
  size,
  className = '',
  ...rest
}: FileInputProps) {
  return (
    <input
      type="file"
      className={`file-input ${variant ? `file-input-${variant}` : ''} ${
        size ? `file-input-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
