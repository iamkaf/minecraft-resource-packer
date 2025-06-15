import React from 'react';

export default function Countdown({ value }: { value: number }) {
  return (
    <span className="countdown font-mono text-2xl" data-testid="countdown">
      <span style={{ '--value': value } as React.CSSProperties} />
    </span>
  );
}
