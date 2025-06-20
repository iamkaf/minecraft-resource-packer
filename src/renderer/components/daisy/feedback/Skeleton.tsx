import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export default function Skeleton({
  width,
  height,
  className = '',
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{ width, height }}
      data-testid="skeleton"
      {...rest}
    />
  );
}
