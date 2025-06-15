import React from 'react';

export default function Steps({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`steps ${className}`.trim()} {...rest}>
      {children}
    </ul>
  );
}
