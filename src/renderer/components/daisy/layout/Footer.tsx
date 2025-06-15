import React from 'react';

export default function Footer({
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={`footer ${className}`.trim()} {...rest}>
      {children}
    </footer>
  );
}
