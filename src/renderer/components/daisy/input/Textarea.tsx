import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Textarea({
  className = '',
  variant,
  size,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      className={`textarea ${variant ? `textarea-${variant}` : ''} ${
        size ? `textarea-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  );
}
