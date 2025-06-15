import React from 'react';

export default function Dock({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`dock ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
