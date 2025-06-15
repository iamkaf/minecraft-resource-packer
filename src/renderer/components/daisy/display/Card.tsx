import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="card bg-base-100 shadow" data-testid="card">
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
