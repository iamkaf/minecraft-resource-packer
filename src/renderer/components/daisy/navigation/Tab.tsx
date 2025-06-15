import React from 'react';

export default function Tab({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button role="tab" className={`tab ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
