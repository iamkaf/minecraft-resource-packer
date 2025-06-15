import React from 'react';

interface DiffProps {
  before: React.ReactNode;
  after: React.ReactNode;
}

export default function Diff({ before, after }: DiffProps) {
  return (
    <div className="diff" data-testid="diff">
      <div className="diff-item-1">{before}</div>
      <div className="diff-item-2">{after}</div>
    </div>
  );
}
