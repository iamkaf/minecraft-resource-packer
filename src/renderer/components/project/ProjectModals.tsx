import React from 'react';
import RenameModal from '../modals/RenameModal';
import ConfirmModal from '../modals/ConfirmModal';
import { useAppStore } from '../../store';
import type { ToastType } from '../providers/ToastProvider';

export default function ProjectModals({
  refresh,
  toast,
}: {
  refresh: () => void;
  toast: (opts: { message: string; type?: ToastType }) => void;
}) {
  const {
    duplicateTarget,
    deleteTarget,
    deleteMany,
    deleteManyAfter,
    closeProjectModals,
  } = useAppStore((s) => ({
    duplicateTarget: s.duplicateTarget,
    deleteTarget: s.deleteTarget,
    deleteMany: s.deleteMany,
    deleteManyAfter: s.deleteManyAfter,
    closeProjectModals: s.closeProjectModals,
  }));

  return (
    <>
      {duplicateTarget && (
        <RenameModal
          current={`${duplicateTarget} Copy`}
          title="Duplicate Project"
          confirmText="Duplicate"
          onCancel={closeProjectModals}
          onRename={(newName) => {
            const src = duplicateTarget;
            closeProjectModals();
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
          onCancel={closeProjectModals}
          onConfirm={() => {
            const target = deleteTarget;
            closeProjectModals();
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
          onCancel={closeProjectModals}
          onConfirm={() => {
            const targets = deleteMany;
            const after = deleteManyAfter;
            closeProjectModals();
            Promise.all(
              targets.map((t) => window.electronAPI?.deleteProject(t))
            ).then(() => {
              refresh();
              after?.();
              toast({ message: 'Projects deleted', type: 'info' });
            });
          }}
        />
      )}
    </>
  );
}
