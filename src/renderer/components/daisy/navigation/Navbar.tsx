import React from 'react';

export default function Navbar({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`navbar ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
