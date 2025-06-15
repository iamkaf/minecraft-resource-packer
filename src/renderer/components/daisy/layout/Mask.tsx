import React from 'react';

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

export default function Mask({
  type = '',
  className = '',
  children,
  ...rest
}: MaskProps) {
  return (
    <div className={`mask ${type} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
