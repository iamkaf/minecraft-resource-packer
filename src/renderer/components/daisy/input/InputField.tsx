import React from 'react';

export default function InputField({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={`input input-bordered ${className}`.trim()} {...rest} />
  );
}
