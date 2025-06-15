import React from 'react';

export default function Rating({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rating" {...props}>
      {children}
    </div>
  );
}
