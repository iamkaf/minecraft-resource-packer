import React from 'react';

interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Card({
  title,
  children,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`card bg-base-100 shadow ${className}`.trim()}
      data-testid="card"
      {...rest}
    >
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
