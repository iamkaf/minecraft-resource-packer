import React from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import { Button } from './daisy/actions';
import { formatTextureName } from '../utils/textureNames';

export interface TextureInfo {
  name: string;
  url: string;
}

interface Props {
  textures: TextureInfo[];
  zoom: number;
  onSelect: (name: string) => void;
  testId?: string;
}

interface CellData {
  textures: TextureInfo[];
  columnCount: number;
  zoom: number;
  onSelect: (name: string) => void;
}

const Cell: React.FC<GridChildComponentProps<CellData>> = ({
  columnIndex,
  rowIndex,
  style,
  data,
}) => {
  const index = rowIndex * data.columnCount + columnIndex;
  if (index >= data.textures.length) return null;
  const tex = data.textures[index];
  const formatted = formatTextureName(tex.name);
  return (
    <div style={style} className="p-2 box-border">
      <div
        className="text-center tooltip"
        data-tip={`${formatted} \n${tex.name}`}
      >
        <Button
          aria-label={tex.name}
          onClick={() => data.onSelect(tex.name)}
          className="p-1 hover:ring ring-accent rounded"
        >
          <img
            src={tex.url}
            alt={formatted}
            style={{
              width: data.zoom,
              height: data.zoom,
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
};

const TextureGrid: React.FC<Props> = ({ textures, zoom, onSelect, testId }) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 640;
  const columnWidth = zoom + 40;
  const rowHeight = zoom + 48;
  const columnCount = Math.max(1, Math.floor(width / columnWidth));
  const rowCount = Math.ceil(textures.length / columnCount);
  return (
    <div
      style={{ height: '12rem' }}
      data-testid={testId}
      className="overflow-y-auto"
    >
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={192}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={columnCount * columnWidth}
        itemData={{ textures, columnCount, zoom, onSelect }}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default TextureGrid;
