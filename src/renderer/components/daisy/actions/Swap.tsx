import React from 'react';

interface SwapProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onContent: React.ReactNode;
  offContent: React.ReactNode;
  className?: string;
}

export default function Swap({
  onContent,
  offContent,
  className = '',
  ...rest
}: SwapProps) {
  return (
    <label className={`swap ${className}`.trim()} data-testid="daisy-swap">
      <input type="checkbox" {...rest} />
      <div className="swap-on">{onContent}</div>
      <div className="swap-off">{offContent}</div>
    </label>
  );
}
