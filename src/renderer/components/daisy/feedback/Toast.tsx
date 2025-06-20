import React from 'react';

export type ToastPosition =
  | 'start'
  | 'center'
  | 'end'
  | 'top'
  | 'middle'
  | 'bottom';

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ToastPosition;
}

export default function Toast({
  children,
  position = 'end',
  className = '',
  ...rest
}: ToastProps & { children: React.ReactNode }) {
  return (
    <div className={`toast toast-${position} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
