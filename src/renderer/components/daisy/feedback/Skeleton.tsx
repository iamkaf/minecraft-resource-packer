import React from 'react';

export default function Skeleton({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className="skeleton"
      style={{ width, height }}
      data-testid="skeleton"
    />
  );
}
