import React from 'react';

export default function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ul className="timeline" data-testid="timeline">
      {children}
    </ul>
  );
}
