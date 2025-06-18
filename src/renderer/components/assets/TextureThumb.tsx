import React from 'react';
import path from 'path';
import { toPosixPath } from '../../../shared/toPosixPath';
import TextIcon from '../common/TextIcon';

interface Props {
  /** Relative texture path or null when no image */
  texture: string | null;
  /** Accessible label, defaults to texture name */
  alt?: string;
  /** Size in pixels */
  size?: number;
  /** Protocol prefix for the texture URL */
  protocol?: 'asset' | 'vanilla';
  /** Use simplified markup without border wrapper */
  simplified?: boolean;
  /** Optional cache-busting stamp */
  stamp?: number;
}

export default function TextureThumb({
  texture,
  alt,
  size = 64,
  protocol = 'asset',
  simplified = false,
  stamp,
}: Props) {
  const ext = texture ? path.extname(texture).toLowerCase() : '';
  const url =
    texture && ext === '.png'
      ? `${protocol}://${toPosixPath(texture)}${stamp ? `?t=${stamp}` : ''}`
      : null;
  const isText = ext === '.txt' || ext === '.json';

  let content: React.ReactNode;
  if (url) {
    content = (
      <img
        src={url}
        alt={alt ?? texture ?? ''}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        data-testid={simplified ? 'texture-thumb' : undefined}
      />
    );
  } else if (isText) {
    content = <TextIcon size={size} />;
  } else {
    content = (
      <div
        data-testid={simplified ? 'texture-thumb' : undefined}
        style={{ width: size, height: size }}
        className="bg-base-300 flex items-center justify-center text-xs"
      >
        {alt ?? 'No preview'}
      </div>
    );
  }

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
