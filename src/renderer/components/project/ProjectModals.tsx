import React from 'react';
import RenameModal from '../modals/RenameModal';
import ConfirmModal from '../modals/ConfirmModal';
import type { ToastType } from '../providers/ToastProvider';
import { useAppStore } from '../../store';

export default function ProjectModals({
  refresh,
  toast,
}: {
  refresh: () => void;
  toast: (opts: { message: string; type?: ToastType }) => void;
}) {
  const duplicateTarget = useAppStore((s) => s.duplicateTarget);
  const deleteTarget = useAppStore((s) => s.deleteTarget);
  const deleteMany = useAppStore((s) => s.deleteMany);
  const deleteManyAfter = useAppStore((s) => s.deleteManyAfter);
  const setDuplicateTarget = useAppStore((s) => s.setDuplicateTarget);
  const setDeleteTarget = useAppStore((s) => s.setDeleteTarget);
  const setDeleteMany = useAppStore((s) => s.setDeleteMany);

  return (
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
              deleteManyAfter?.();
              toast({ message: 'Projects deleted', type: 'info' });
            });
          }}
        />
      )}
    </>
  );
}
