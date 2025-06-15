import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hint?: React.ReactNode;
}

export default function Validator({ children, hint, ...props }: Props) {
  return (
    <div {...props} className={`validator ${props.className ?? ''}`.trim()}>
      {children}
      {hint && <span className="validator-hint">{hint}</span>}
    </div>
  );
}
