import React from 'react';

export default function Link({
  children,
  className = '',
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`link ${className}`.trim()} {...rest}>
      {children}
    </a>
  );
}
