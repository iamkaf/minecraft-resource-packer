import React, { useEffect, useState } from 'react';
import type { TextureInfo } from './TextureGrid';

export default function TextureInfoPanel({
  texture,
}: {
  texture: TextureInfo | null;
}) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!texture) return;
    const img = new Image();
    img.onload = () => setSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = texture.url;
  }, [texture]);

  if (!texture) return <div className="p-2">No asset selected</div>;
  return (
    <div className="p-2" data-testid="texture-info">
      <img
        src={texture.url}
        alt={texture.name}
        className="mb-2 border"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="text-sm">{texture.name}</div>
      {size && (
        <div className="text-xs opacity-70">
          {size.w}×{size.h}
        </div>
      )}
    </div>
  );
}
