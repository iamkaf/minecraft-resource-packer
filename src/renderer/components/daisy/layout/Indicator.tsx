import React from 'react';

interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: React.ReactNode;
}

export default function Indicator({
  item,
  className = '',
  children,
  ...rest
}: IndicatorProps) {
  return (
    <div className={`indicator ${className}`.trim()} {...rest}>
      {item && <span className="indicator-item">{item}</span>}
      {children}
    </div>
  );
}
