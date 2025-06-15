import React from 'react';

export default function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
}
