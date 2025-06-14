import React, { useState } from 'react';
import RenameModal from '../RenameModal';
import ConfirmModal from '../ConfirmModal';

export function useProjectModals(
  refresh: () => void,
  toast: (msg: string, type: 'success' | 'info' | 'error') => void
) {
  const [duplicateTarget, setDuplicateTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const modals = (
    <>
      {duplicateTarget && (
        <RenameModal
          current={`${duplicateTarget} Copy`}
          title="Duplicate Project"
          confirmText="Duplicate"
          onCancel={() => setDuplicateTarget(null)}
          onRename={(newName) => {
            const src = duplicateTarget;
            setDuplicateTarget(null);
            window.electronAPI?.duplicateProject(src, newName).then(() => {
              refresh();
              toast('Project duplicated', 'success');
            });
          }}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Project"
          message={`Delete project ${deleteTarget}?`}
          confirmText="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            setDeleteTarget(null);
            window.electronAPI?.deleteProject(target).then(() => {
              refresh();
              toast('Project deleted', 'info');
            });
          }}
        />
      )}
    </>
  );

  return {
    modals,
    openDuplicate: setDuplicateTarget,
    openDelete: setDeleteTarget,
  };
}
