import React, { useState } from 'react';
import path from 'path';
import RenameModal from '../modals/RenameModal';
import MoveFileModal from '../modals/MoveFileModal';
import { useProjectFiles } from '../file/useProjectFiles';
import { useAppStore } from '../../store';
import type { Filter, ControlsState } from './AssetBrowserControls';
import BrowserBody from './BrowserBody';
import { normalizeForCategory, getCategory } from '../../utils/category';


const AssetBrowser: React.FC = () => {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const { files, noExport, versions } = useProjectFiles();
  React.useEffect(() => {
    useAppStore.setState({ noExport });
  }, [noExport]);
  const renameTarget = useAppStore((s) => s.renameTarget);
  const moveTarget = useAppStore((s) => s.moveTarget);
  const closeDialogs = useAppStore((s) => s.closeDialogs);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(64);
  const [filters, setFilters] = useState<Filter[]>([]);

  const visible = React.useMemo(
    () =>
      files.filter((f) => {
        if (query && !f.includes(query)) return false;
        const cat = getCategory(normalizeForCategory(f));
        if (filters.length > 0) {
          if (cat === 'misc') return false;
          if (!filters.includes(cat)) return false;
        }
        return true;
      }),
    [files, query, filters]
  );


  const handleControlsChange = (state: ControlsState) => {
    setQuery(state.query);
    setZoom(state.zoom);
    setFilters(state.filters);
  };

  return (
    <>
      <BrowserBody
        projectPath={projectPath}
        files={visible}
        versions={versions}
        zoom={zoom}
        onControlsChange={handleControlsChange}
      />
      {renameTarget && (
        <RenameModal
          current={path.basename(renameTarget)}
          onCancel={closeDialogs}
          onRename={(n) => {
            const full = path.join(projectPath, renameTarget);
            const target = path.join(path.dirname(full), n);
            window.electronAPI?.renameFile(full, target);
            closeDialogs();
          }}
        />
      )}
      {moveTarget && (
        <MoveFileModal
          current={moveTarget}
          onCancel={closeDialogs}
          onMove={(dest) => {
            const full = path.join(projectPath, moveTarget);
            const target = path.join(
              projectPath,
              dest,
              path.basename(moveTarget)
            );
            window.electronAPI?.renameFile(full, target);
            closeDialogs();
          }}
        />
      )}
    </>
  );
};

export default AssetBrowser;
