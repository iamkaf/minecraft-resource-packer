import React from 'react';

interface CountdownProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
}

export default function Countdown({
  value,
  className = '',
  ...rest
}: CountdownProps) {
  return (
    <span
      className={`countdown font-mono text-2xl ${className}`.trim()}
      data-testid="countdown"
      {...rest}
    >
      <span style={{ '--value': value } as React.CSSProperties} />
    </span>
  );
}
