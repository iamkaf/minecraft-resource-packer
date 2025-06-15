import React from 'react';

interface TableProps {
  head?: React.ReactNode;
  children: React.ReactNode;
}

export default function Table({ head, children }: TableProps) {
  return (
    <div className="overflow-x-auto" data-testid="table">
      <table className="table">
        {head && <thead>{head}</thead>}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
