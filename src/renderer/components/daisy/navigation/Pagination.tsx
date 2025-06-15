import React from 'react';

export default function Pagination({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`join ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
