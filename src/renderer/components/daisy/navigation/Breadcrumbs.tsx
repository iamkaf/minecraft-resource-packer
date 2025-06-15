import React from 'react';

export default function Breadcrumbs({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`breadcrumbs ${className}`.trim()} {...rest}>
      <ul>{children}</ul>
    </div>
  );
}
