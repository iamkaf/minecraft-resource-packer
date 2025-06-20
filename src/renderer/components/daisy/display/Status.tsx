import React from 'react';

interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
}

export default function Status({
  color = 'primary',
  className = '',
  ...rest
}: StatusProps) {
  return (
    <span
      className={`status status-${color} ${className}`.trim()}
      data-testid="status"
      {...rest}
    />
  );
}
