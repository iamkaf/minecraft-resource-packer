import React from 'react';

interface CollapseProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function Collapse({ title, children }: CollapseProps) {
  return (
    <div
      className="collapse rounded-box border border-base-300"
      data-testid="collapse"
    >
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
