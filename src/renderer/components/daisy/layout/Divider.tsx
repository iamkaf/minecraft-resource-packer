import React from 'react';

export default function Divider({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`divider ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
