import React from 'react';

export default function Radio(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input type="radio" className="radio" {...props} />;
}
