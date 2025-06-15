import React from 'react';

export default function Hero({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`hero ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
