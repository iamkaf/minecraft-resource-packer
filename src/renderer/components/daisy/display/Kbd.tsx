import React from 'react';

export default function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="kbd" data-testid="kbd">
      {children}
    </kbd>
  );
}
