import React, { useEffect, useState, useRef } from 'react';
import path from 'path';
import { Modal, Button } from '../daisy/actions';
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

  const basename = (rev: string) => path.parse(rev).name;

  return (
    <Modal open onClose={onClose} className="max-w-sm">
      <h3 className="font-bold text-lg mb-2">Revisions</h3>
      <ul className="menu bg-base-200 rounded-box mb-2 max-h-60 overflow-y-auto">
        {list.map((rev) => (
          <li key={rev} className="menu-item">
            <button
              type="button"
              className="flex justify-between w-full"
              onClick={() => restore(rev)}
            >
              <span>{new Date(Number(basename(rev))).toLocaleString()}</span>
              <span className="text-primary">Restore</span>
            </button>
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
  );
}
