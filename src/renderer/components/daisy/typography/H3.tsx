import React from 'react';

export default function H3({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-bold ${className}`.trim()}
      data-testid="h3"
      {...rest}
    >
      {children}
    </h3>
  );
}
