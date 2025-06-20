import React from 'react';
import type { DaisyColor, DaisySize } from '../types';
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Paragraph({
  children,
  variant,
  size,
  className = '',
  ...rest
}: ParagraphProps) {
  return (
    <p
      className={`mb-2 ${variant ? `text-${variant}` : ''} ${
        size ? `text-${size}` : ''
      } ${className}`.trim()}
      data-testid="paragraph"
      {...rest}
    >
      {children}
    </p>
  );
}
