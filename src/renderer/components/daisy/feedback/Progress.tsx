import React from 'react';

export type ProgressColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

interface ProgressProps
  extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  value: number;
  max: number;
  color?: ProgressColor;
}

export default function Progress({
  value,
  max,
  color = 'primary',
  className = '',
  ...rest
}: ProgressProps) {
  return (
    <progress
      className={`progress progress-${color} ${className}`.trim()}
      value={value}
      max={max}
      data-testid="progress"
      {...rest}
    />
  );
}
