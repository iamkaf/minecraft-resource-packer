import React from 'react';

export default function Toggle(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input type="checkbox" className="toggle" {...props} />;
}
