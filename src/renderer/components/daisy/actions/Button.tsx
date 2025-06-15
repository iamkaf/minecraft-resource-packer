import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn ${className}`.trim()}
      {...rest}
      data-testid="daisy-button"
    >
      {children}
    </button>
  );
}
