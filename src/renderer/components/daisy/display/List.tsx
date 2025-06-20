import React from 'react';

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

export default function List({ children, className = '', ...rest }: ListProps) {
  return (
    <ul
      className={`list list-disc ${className}`.trim()}
      data-testid="list"
      {...rest}
    >
      {children}
    </ul>
  );
}
