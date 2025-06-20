import React from 'react';
import type { DaisyColor, DaisySize } from '../types';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: DaisyColor;
  size?: DaisySize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant, size, ...rest }, ref) => (
    <button
      ref={ref}
      className={`btn ${variant ? `btn-${variant}` : ''} ${
        size ? `btn-${size}` : ''
      } ${className}`.trim()}
      {...rest}
      data-testid="daisy-button"
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
