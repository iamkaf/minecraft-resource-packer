import React from 'react';

export type LoadingStyle =
  | 'spinner'
  | 'dots'
  | 'ring'
  | 'ball'
  | 'bars'
  | 'infinity';
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export default function Loading({
  style = 'spinner',
  size = 'md',
}: {
  style?: LoadingStyle;
  size?: LoadingSize;
}) {
  return (
    <span
      className={`loading loading-${style} loading-${size}`}
      aria-label="loading"
      data-testid="loading"
    />
  );
}
