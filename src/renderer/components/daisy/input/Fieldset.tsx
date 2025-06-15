import React from 'react';

export default function Fieldset({
  children,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset className="fieldset" {...props}>
      {children}
    </fieldset>
  );
}
