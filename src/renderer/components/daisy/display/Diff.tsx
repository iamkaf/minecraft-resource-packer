import React from 'react';

interface DiffProps extends React.HTMLAttributes<HTMLDivElement> {
  before: React.ReactNode;
  after: React.ReactNode;
}

export default function Diff({
  before,
  after,
  className = '',
  ...rest
}: DiffProps) {
  return (
    <div className={`diff ${className}`.trim()} data-testid="diff" {...rest}>
      <div className="diff-item-1">{before}</div>
      <div className="diff-item-2">{after}</div>
    </div>
  );
}
