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

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  tip: string;
  position?: TooltipPosition;
}

export default function Tooltip({
  tip,
  children,
  position,
  className = '',
  ...rest
}: TooltipProps & { children: React.ReactNode }) {
  const posClass = position ? `tooltip-${position}` : '';
  return (
    <div
      className={`tooltip ${posClass} ${className}`.trim()}
      data-tip={tip}
      {...rest}
    >
      {children}
    </div>
  );
}
