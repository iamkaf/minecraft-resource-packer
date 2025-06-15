import React from 'react';

export default function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list list-disc" data-testid="list">
      {children}
    </ul>
  );
}
