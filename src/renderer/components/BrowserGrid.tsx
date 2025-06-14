import React from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import AssetBrowserItem from './AssetBrowserItem';

interface Props {
  files: string[];
  projectPath: string;
  zoom: number;
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  noExport: Set<string>;
  toggleNoExport: (files: string[], flag: boolean) => void;
  confirmDelete: (files: string[]) => void;
  openRename: (file: string) => void;
}

interface CellData extends Props {
  columnCount: number;
}

const Cell: React.FC<GridChildComponentProps<CellData>> = ({
  columnIndex,
  rowIndex,
  style,
  data,
}) => {
  const index = rowIndex * data.columnCount + columnIndex;
  if (index >= data.files.length) return null;
  const file = data.files[index];
  return (
    <div style={style} className="p-1 box-border">
      <AssetBrowserItem
        projectPath={data.projectPath}
        file={file}
        selected={data.selected}
        setSelected={data.setSelected}
        noExport={data.noExport}
        toggleNoExport={data.toggleNoExport}
        confirmDelete={data.confirmDelete}
        openRename={data.openRename}
      />
    </div>
  );
};

export default function BrowserGrid(props: Props) {
  const { files, zoom } = props;
  const width = typeof window !== 'undefined' ? window.innerWidth : 640;
  const cell = zoom + 40;
  const columnCount = Math.max(1, Math.floor(width / cell));
  const rowCount = Math.ceil(files.length / columnCount);
  return (
    <Grid
      columnCount={columnCount}
      columnWidth={cell}
      height={192}
      rowCount={rowCount}
      rowHeight={zoom + 48}
      width={columnCount * cell}
      itemData={{ ...props, columnCount }}
    >
      {Cell}
    </Grid>
  );
}
