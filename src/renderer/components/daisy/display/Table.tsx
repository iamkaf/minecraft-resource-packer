import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  head?: React.ReactNode;
  children: React.ReactNode;
}

export default function Table({
  head,
  children,
  className = '',
  ...rest
}: TableProps) {
  return (
    <div
      className={`overflow-x-auto ${className}`.trim()}
      data-testid="table"
      {...rest}
    >
      <table className="table">
        {head && <thead>{head}</thead>}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
