import React from 'react';

export default function H2({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-2xl font-bold ${className}`.trim()}
      data-testid="h2"
      {...rest}
    >
      {children}
    </h2>
  );
}
