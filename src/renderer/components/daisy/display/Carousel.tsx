import React from 'react';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Carousel({
  children,
  className = '',
  ...rest
}: CarouselProps) {
  return (
    <div
      className={`carousel ${className}`.trim()}
      data-testid="carousel"
      {...rest}
    >
      {children}
    </div>
  );
}
