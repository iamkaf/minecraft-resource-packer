import React, { useEffect, useState, useRef } from 'react';
import path from 'path';
import { Modal, Button } from '../daisy/actions';
import ConfirmModal from './ConfirmModal';
import { useAppStore } from '../../store';
import { useToast } from '../providers/ToastProvider';

export default function RevisionsModal({
  asset,
  onClose,
}: {
  asset: string;
  onClose: () => void;
}) {
  const projectPath = useAppStore((s) => s.projectPath)!;
  const toast = useToast();
  const [list, setList] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [action, setAction] = useState<'restore' | 'delete'>('restore');

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!projectPath) return;
    window.electronAPI
      ?.listRevisions(projectPath, asset)
      .then((l) => {
        if (l) setList(l);
      })
      .catch(() => {
        /* ignore */
      });
  }, [projectPath, asset]);

  const restore = (rev: string) => {
    if (!projectPath) return;
    window.electronAPI
      ?.restoreRevision(projectPath, asset, rev)
      .then(() => toast({ message: 'Revision restored', type: 'success' }))
      .catch(() => toast({ message: 'Failed to restore', type: 'error' }));
  };

  const askRestore = (rev: string) => {
    setAction('restore');
    setPending(rev);
  };

  const askDelete = (rev: string) => {
    setAction('delete');
    setPending(rev);
  };

  const remove = (rev: string) => {
    if (!projectPath) return;
    window.electronAPI
      ?.deleteRevision(projectPath, asset, rev)
      .then(() => {
        setList((l) => l.filter((x) => x !== rev));
        toast({ message: 'Revision deleted', type: 'info' });
      })
      .catch(() => toast({ message: 'Failed to delete', type: 'error' }));
  };

  const confirm = () => {
    if (!pending) return;
    if (action === 'restore') restore(pending);
    else remove(pending);
    setPending(null);
  };

  const basename = (rev: string) => path.parse(rev).name;

  return (
    <>
      <Modal open onClose={onClose} className="max-w-sm">
        <h3 className="font-bold text-lg mb-2">Revisions</h3>
        <ul className="menu bg-base-200 rounded-box mb-2 max-h-60 overflow-y-auto">
          {list.map((rev) => (
            <li key={rev} className="menu-item">
              <div className="flex justify-between w-full">
                <span>{new Date(Number(basename(rev))).toLocaleString()}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-primary"
                    onClick={() => askRestore(rev)}
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    className="text-error"
                    onClick={() => askDelete(rev)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="p-2">No revisions</li>}
        </ul>
        <div className="modal-action">
          <Button ref={closeRef} onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
      {pending && action === 'restore' && (
        <ConfirmModal
          title="Restore Revision"
          message="Restore this revision?"
          confirmText="Restore"
          onCancel={() => setPending(null)}
          onConfirm={confirm}
        />
      )}
      {pending && action === 'delete' && (
        <ConfirmModal
          title="Delete Revision"
          message="Delete this revision?"
          confirmText="Delete"
          onCancel={() => setPending(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
