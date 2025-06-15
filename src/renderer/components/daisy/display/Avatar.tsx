import React from 'react';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
}

export default function Avatar({ src, alt, size = 64 }: AvatarProps) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  } as React.CSSProperties;
  return (
    <div className="avatar" data-testid="avatar">
      <div className="rounded" style={style}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
