import React from 'react';

export type ToastPosition =
  | 'start'
  | 'center'
  | 'end'
  | 'top'
  | 'middle'
  | 'bottom';

export default function Toast({
  children,
  position = 'end',
}: {
  children: React.ReactNode;
  position?: ToastPosition;
}) {
  return <div className={`toast toast-${position}`}>{children}</div>;
}
