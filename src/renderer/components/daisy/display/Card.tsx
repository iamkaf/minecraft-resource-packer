import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  variant?: DaisyColor;
  size?: DaisySize;
}

export default function Card({
  title,
  children,
  variant,
  size,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`card bg-base-100 shadow ${
        variant ? `bg-${variant} text-${variant}-content` : ''
      } ${size ? `card-${size}` : ''} ${className}`.trim()}
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
