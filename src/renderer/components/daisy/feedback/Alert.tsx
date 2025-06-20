import React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

import type { DaisySize } from '../types';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: DaisySize;
}

export default function Alert({
  children,
  variant = 'info',
  size,
  className = '',
  ...rest
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`alert alert-${variant} ${size ? `alert-${size}` : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
