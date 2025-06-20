import React from 'react';

interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: string;
  thickness?: string;
}

export default function RadialProgress({
  value,
  size = '5rem',
  thickness,
  className = '',
  ...rest
}: RadialProgressProps) {
  return (
    <div
      className={`radial-progress ${className}`.trim()}
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
      {...rest}
    >
      {value}%
    </div>
  );
}
