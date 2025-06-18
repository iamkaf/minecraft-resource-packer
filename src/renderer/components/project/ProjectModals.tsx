import React, { useState, useRef } from 'react';
import RenameModal from '../modals/RenameModal';
import ConfirmModal from '../modals/ConfirmModal';
import type { ToastType } from '../providers/ToastProvider';

export function useProjectModals(
  refresh: () => void,
  toast: (opts: { message: string; type?: ToastType }) => void
) {
  const [duplicateTarget, setDuplicateTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteMany, setDeleteMany] = useState<string[] | null>(null);
  const deleteManyAfter = useRef<(() => void) | null>(null);

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
      {deleteMany && (
        <ConfirmModal
          title="Delete Projects"
          message={`Delete ${deleteMany.length} projects?`}
          confirmText="Delete"
          onCancel={() => setDeleteMany(null)}
          onConfirm={() => {
            const targets = deleteMany;
            setDeleteMany(null);
            Promise.all(
              targets.map((t) => window.electronAPI?.deleteProject(t))
            ).then(() => {
              refresh();
              deleteManyAfter.current?.();
              toast({ message: 'Projects deleted', type: 'info' });
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
    openDeleteMany: (names: string[], cb?: () => void) => {
      deleteManyAfter.current = cb ?? null;
      setDeleteMany(names);
    },
  };
}
