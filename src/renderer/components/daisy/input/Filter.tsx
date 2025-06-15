import React from 'react';

export default function Filter({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="filter" {...props}>
      {children}
    </div>
  );
}
