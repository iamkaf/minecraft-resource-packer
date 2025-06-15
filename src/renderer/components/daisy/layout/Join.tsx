import React from 'react';

export default function Join({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`join ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
