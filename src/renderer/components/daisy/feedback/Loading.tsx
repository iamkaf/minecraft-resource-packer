import React from 'react';

export type LoadingStyle =
  | 'spinner'
  | 'dots'
  | 'ring'
  | 'ball'
  | 'bars'
  | 'infinity';
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  loadingStyle?: LoadingStyle;
  size?: LoadingSize;
}

export default function Loading({
  loadingStyle = 'spinner',
  size = 'md',
  className = '',
  ...rest
}: LoadingProps) {
  return (
    <span
      className={`loading loading-${loadingStyle} loading-${size} ${className}`.trim()}
      aria-label="loading"
      data-testid="loading"
      {...rest}
    />
  );
}
