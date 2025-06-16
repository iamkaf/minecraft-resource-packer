import React from 'react';

export default function H1({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={`text-3xl font-bold ${className}`.trim()}
      data-testid="h1"
      {...rest}
    >
      {children}
    </h1>
  );
}
