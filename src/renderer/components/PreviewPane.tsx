import React, { useState } from 'react';

interface PreviewPaneProps {
  texture: string | null;
  lighting?: 'neutral' | 'none';
}

export default function PreviewPane({
  texture,
  lighting = 'neutral',
}: PreviewPaneProps) {
  const [zoom, setZoom] = useState(1);
  const bgClass = lighting === 'neutral' ? 'bg-gray-200' : 'bg-transparent';

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!texture) return;
    e.preventDefault();
    setZoom((z) => {
      const next = z + (e.deltaY < 0 ? 1 : -1);
      return Math.min(8, Math.max(1, next));
    });
  };

  return (
    <div
      data-testid="preview-pane"
      onWheel={handleWheel}
      style={{ height: '128px', width: '128px' }}
      className={`border p-2 flex flex-col items-center justify-center ${bgClass}`}
    >
      {texture ? (
        <>
          <img
            src={`ptex://${texture}`}
            alt={texture}
            style={{
              imageRendering: 'pixelated',
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
            }}
          />
        </>
      ) : (
        <span>No preview</span>
      )}
    </div>
  );
}
