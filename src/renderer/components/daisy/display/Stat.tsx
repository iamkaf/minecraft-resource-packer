import React from 'react';

interface StatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  value: React.ReactNode;
  desc?: React.ReactNode;
}

export default function Stat({
  title,
  value,
  desc,
  className = '',
  ...rest
}: StatProps) {
  return (
    <div className={`stat ${className}`.trim()} data-testid="stat" {...rest}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {desc && <div className="stat-desc">{desc}</div>}
    </div>
  );
}
