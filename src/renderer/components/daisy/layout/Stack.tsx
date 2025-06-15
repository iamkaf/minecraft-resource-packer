import React from 'react';

export default function Stack({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`stack ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
