import React from 'react';

export default function Range({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type="range" className={`range ${className}`.trim()} {...rest} />
  );
}
