import React from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export default function Alert({
  children,
  type = 'info',
}: {
  children: React.ReactNode;
  type?: AlertType;
}) {
  return (
    <div role="alert" className={`alert alert-${type}`}>
      {children}
    </div>
  );
}
