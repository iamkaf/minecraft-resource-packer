import React, { useState } from 'react';

interface PreviewPaneProps {
  texture: string | null;
  lighting?: 'neutral' | 'none';
  protocol?: 'ptex' | 'texture' | '';
}

export default function PreviewPane({
  texture,
  lighting = 'neutral',
  protocol = 'ptex',
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
      className={`border p-2 flex flex-col items-center ${bgClass}`}
    >
      {texture ? (
        <>
          <img
            src={protocol ? `${protocol}://${texture}` : (texture ?? '')}
            alt={texture ?? ''}
            style={{
              imageRendering: 'pixelated',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          />
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={zoom}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="range range-xs w-32 mt-2"
          />
        </>
      ) : (
        <span>No preview</span>
      )}
    </div>
  );
}
