import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', ...rest }, ref) => (
    <button
      ref={ref}
      className={`btn ${className}`.trim()}
      {...rest}
      data-testid="daisy-button"
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
