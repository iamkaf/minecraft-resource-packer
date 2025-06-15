import React from 'react';

export default function RadialProgress({
  value,
  size = '5rem',
  thickness,
}: {
  value: number;
  size?: string;
  thickness?: string;
}) {
  return (
    <div
      className="radial-progress"
      style={
        {
          '--value': value.toString(),
          '--size': size,
          ...(thickness ? { '--thickness': thickness } : {}),
        } as React.CSSProperties
      }
      role="progressbar"
      aria-valuenow={value}
      data-testid="radial-progress"
    >
      {value}%
    </div>
  );
}
