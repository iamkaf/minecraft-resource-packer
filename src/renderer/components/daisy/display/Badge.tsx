import React from 'react';

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="badge" data-testid="badge">
      {children}
    </span>
  );
}
