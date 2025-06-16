import React from 'react';

interface CollapseProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function Collapse({
  title,
  children,
  className = '',
  defaultOpen = false,
}: CollapseProps) {
  return (
    <div
      className={`collapse rounded-box border border-base-300 ${className}`.trim()}
      data-testid="collapse"
    >
      <input type="checkbox" defaultChecked={defaultOpen} />
      <div className="collapse-title text-lg font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
