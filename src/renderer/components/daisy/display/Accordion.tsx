import React from 'react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  return (
    <div
      className="collapse collapse-arrow rounded-box border border-base-300"
      data-testid="accordion"
    >
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
