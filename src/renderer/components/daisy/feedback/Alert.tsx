import React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export default function Alert({
  children,
  variant = 'info',
  className = '',
  ...rest
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`alert alert-${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
