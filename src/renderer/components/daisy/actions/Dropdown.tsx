import React from 'react';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Dropdown({
  label,
  children,
  className = '',
  ...rest
}: DropdownProps) {
  return (
    <div
      className={`dropdown ${className}`.trim()}
      data-testid="daisy-dropdown"
      {...rest}
    >
      <div tabIndex={0} role="button" className="btn m-1">
        {label}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {children}
      </ul>
    </div>
  );
}
