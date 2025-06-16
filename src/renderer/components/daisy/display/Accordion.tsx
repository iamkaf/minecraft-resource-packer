import React from 'react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  children,
  className = '',
  defaultOpen = false,
}: AccordionProps) {
  return (
    <div
      className={`collapse collapse-arrow rounded-box border border-base-300 ${className}`.trim()}
      data-testid="accordion"
    >
      <input type="checkbox" defaultChecked={defaultOpen} />
      <div className="collapse-title text-lg font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
