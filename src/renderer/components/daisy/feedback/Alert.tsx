import React from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export default function Alert({
  children,
  variant = 'info',
}: {
  children: React.ReactNode;
  variant?: AlertVariant;
}) {
  return (
    <div role="alert" className={`alert alert-${variant}`}>
      {children}
    </div>
  );
}
