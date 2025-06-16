import React from 'react';

export default function Paragraph({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mb-2 ${className}`.trim()} data-testid="paragraph" {...rest}>
      {children}
    </p>
  );
}
