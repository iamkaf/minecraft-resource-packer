import React from 'react';

interface PreviewPaneProps {
  texture: string | null;
  lighting?: 'neutral' | 'none';
}

export default function PreviewPane({
  texture,
  lighting = 'neutral',
}: PreviewPaneProps) {
  const bgClass = lighting === 'neutral' ? 'bg-gray-200' : 'bg-transparent';
  return (
    <div
      data-testid="preview-pane"
      className={`w-32 h-32 flex items-center justify-center border ${bgClass}`}
    >
      {texture ? (
        <img
          src={`ptex://${texture}`}
          alt={texture}
          className="max-w-full max-h-full"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <span>No preview</span>
      )}
    </div>
  );
}
