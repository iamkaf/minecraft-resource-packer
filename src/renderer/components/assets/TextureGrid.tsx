import React from 'react';
import { Button } from '../daisy/actions';
import { formatTextureName } from '../../utils/textureNames';

export interface TextureInfo {
  name: string;
  url: string;
}

interface Props {
  textures: TextureInfo[];
  zoom: number;
  onSelect: (name: string) => void;
  testId?: string;
  onContextMenu?: (e: React.MouseEvent, name: string) => void;
  onKeyDown?: (e: React.KeyboardEvent, name: string) => void;
}


const TextureGrid: React.FC<Props> = ({
  textures,
  zoom,
  onSelect,
  testId,
  onContextMenu,
  onKeyDown,
}) => {
  return (
    <div
      data-testid={testId}
      // className="overflow-y-auto"
    >
      <div
        className="flex flex-wrap justify-start items-start gap-2"
      >
        {textures.map((tex) => {
          const formatted = formatTextureName(tex.name);
          return (
            <div key={tex.name} className="p-2 box-border">
              <div
                className="text-center tooltip w-[96px] h-[96px]"
                data-tip={`${formatted} \n${tex.name}`}
              >
                <Button
                  aria-label={tex.name}
                  onClick={() => onSelect(tex.name)}
                  onContextMenu={(e) => onContextMenu?.(e, tex.name)}
                  onKeyDown={(e) =>
                    (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) &&
                    onKeyDown?.(e, tex.name)
                  }
                  className="p-1 hover:ring ring-accent rounded"
                >
                  <img
                    src={tex.url}
                    alt={formatted}
                    style={{
                      width: zoom,
                      height: zoom,
                      imageRendering: 'pixelated',
                    }}
                  />
                </Button>
                <div className="text-xs leading-tight">
                  <div>{formatted}</div>
                  <div className="opacity-50">{tex.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TextureGrid;
