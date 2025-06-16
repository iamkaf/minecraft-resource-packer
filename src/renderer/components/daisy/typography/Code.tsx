import React from 'react';

export default function Code({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={`font-mono ${className}`.trim()}
      data-testid="code"
      {...rest}
    >
      {children}
    </code>
  );
}
