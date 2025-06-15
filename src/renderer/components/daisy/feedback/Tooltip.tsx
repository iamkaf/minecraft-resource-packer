import React from 'react';

export type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export default function Tooltip({
  tip,
  children,
  position,
}: {
  tip: string;
  children: React.ReactNode;
  position?: TooltipPosition;
}) {
  const posClass = position ? `tooltip-${position}` : '';
  return (
    <div className={`tooltip ${posClass}`.trim()} data-tip={tip}>
      {children}
    </div>
  );
}
