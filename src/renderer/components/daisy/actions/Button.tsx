import React from 'react';
import type { DaisyColor } from '../types';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: DaisyColor;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant, ...rest }, ref) => (
    <button
      ref={ref}
      className={`btn ${variant ? `btn-${variant}` : ''} ${className}`.trim()}
      {...rest}
      data-testid="daisy-button"
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
