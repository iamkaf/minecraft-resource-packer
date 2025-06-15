import React from 'react';

export default function InputField(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input className="input input-bordered" {...props} />;
}
