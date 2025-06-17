import React from 'react';

export default function Step({
  children,
  active = false,
  className = '',
  ...rest
}: React.LiHTMLAttributes<HTMLLIElement> & { active?: boolean }) {
  return (
    <li
      className={`step${active ? ' step-primary' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </li>
  );
}
