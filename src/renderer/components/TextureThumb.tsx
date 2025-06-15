import React from 'react';
import path from 'path';

interface Props {
  /** Relative texture path or null when no image */
  texture: string | null;
  /** Accessible label, defaults to texture name */
  alt?: string;
  /** Size in pixels */
  size?: number;
  /** Protocol prefix for the texture URL */
  protocol?: 'ptex' | 'texture';
  /** Use simplified markup without border wrapper */
  simplified?: boolean;
}

export default function TextureThumb({
  texture,
  alt,
  size = 64,
  protocol = 'ptex',
  simplified = false,
}: Props) {
  const url =
    texture && texture.endsWith('.png')
      ? `${protocol}://${texture.split(path.sep).join('/')}`
      : null;

  const content = url ? (
    <img
      src={url}
      alt={alt ?? texture ?? ''}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      data-testid={simplified ? 'texture-thumb' : undefined}
    />
  ) : (
    <div
      data-testid={simplified ? 'texture-thumb' : undefined}
      style={{ width: size, height: size }}
      className="bg-base-300 flex items-center justify-center text-xs"
    >
      {alt ?? 'No preview'}
    </div>
  );

  if (simplified) return content;

  return (
    <div
      data-testid="texture-thumb"
      style={{ width: size, height: size }}
      className="border p-2 flex items-center justify-center bg-gray-200"
    >
      {content}
    </div>
  );
}
