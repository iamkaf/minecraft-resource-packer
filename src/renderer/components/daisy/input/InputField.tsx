import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: DaisyColor;
  size?: DaisySize;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className = '', variant, size, ...rest }, ref) => (
    <input
      ref={ref}
      className={`input input-bordered ${variant ? `input-${variant}` : ''} ${
        size ? `input-${size}` : ''
      } ${className}`.trim()}
      {...rest}
    />
  )
);

InputField.displayName = 'InputField';

export default InputField;
