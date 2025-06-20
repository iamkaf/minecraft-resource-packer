import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  size?: number;
}

export default function Avatar({
  src,
  alt,
  size = 64,
  className = '',
  ...rest
}: AvatarProps) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  } as React.CSSProperties;
  return (
    <div
      className={`avatar ${className}`.trim()}
      data-testid="avatar"
      {...rest}
    >
      <div className="rounded" style={style}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
