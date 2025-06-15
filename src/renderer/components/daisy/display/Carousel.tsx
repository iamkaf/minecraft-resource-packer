import React from 'react';

export default function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="carousel" data-testid="carousel">
      {children}
    </div>
  );
}
