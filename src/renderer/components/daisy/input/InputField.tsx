import React from 'react';

const InputField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...rest }, ref) => (
  <input
    ref={ref}
    className={`input input-bordered ${className}`.trim()}
    {...rest}
  />
));

InputField.displayName = 'InputField';

export default InputField;
