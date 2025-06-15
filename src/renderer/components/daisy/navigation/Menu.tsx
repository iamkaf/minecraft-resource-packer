import React from 'react';

export default function Menu({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`menu ${className}`.trim()} {...rest}>
      {children}
    </ul>
  );
}
