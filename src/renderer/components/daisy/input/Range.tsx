import React from 'react';

export default function Range(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input type="range" className="range" {...props} />;
}
