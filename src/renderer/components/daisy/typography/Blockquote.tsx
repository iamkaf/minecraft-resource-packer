import React from 'react';

export default function Blockquote({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={`border-l-4 pl-4 italic ${className}`.trim()}
      data-testid="blockquote"
      {...rest}
    >
      {children}
    </blockquote>
  );
}
