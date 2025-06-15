import React from 'react';

interface StatProps {
  title: React.ReactNode;
  value: React.ReactNode;
  desc?: React.ReactNode;
}

export default function Stat({ title, value, desc }: StatProps) {
  return (
    <div className="stat" data-testid="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {desc && <div className="stat-desc">{desc}</div>}
    </div>
  );
}
