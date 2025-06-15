import React from 'react';

export default function Calendar({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="calendar" {...props}>
      {children}
    </div>
  );
}
