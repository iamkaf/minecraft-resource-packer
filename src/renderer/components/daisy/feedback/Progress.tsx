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

export default function Progress({
  value,
  max,
  color = 'primary',
}: {
  value: number;
  max: number;
  color?: ProgressColor;
}) {
  return (
    <progress
      className={`progress progress-${color}`}
      value={value}
      max={max}
      data-testid="progress"
    />
  );
}
