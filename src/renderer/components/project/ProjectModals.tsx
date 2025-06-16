import React, { useState } from 'react';
import RenameModal from '../RenameModal';
import ConfirmModal from '../ConfirmModal';
import type { ToastType } from '../ToastProvider';

export function useProjectModals(
  refresh: () => void,
  toast: (opts: { message: string; type?: ToastType }) => void
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
              toast({ message: 'Project duplicated', type: 'success' });
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
              toast({ message: 'Project deleted', type: 'info' });
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
