import React from 'react';

export default function Prose({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`prose ${className}`.trim()} data-testid="prose" {...rest}>
      {children}
    </div>
  );
}
