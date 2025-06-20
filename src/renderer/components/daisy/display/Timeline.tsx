import React from 'react';

interface TimelineProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

export default function Timeline({
  children,
  className = '',
  ...rest
}: TimelineProps) {
  return (
    <ul
      className={`timeline ${className}`.trim()}
      data-testid="timeline"
      {...rest}
    >
      {children}
    </ul>
  );
}
