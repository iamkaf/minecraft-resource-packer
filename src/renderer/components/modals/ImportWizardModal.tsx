import React, { useEffect, useRef } from 'react';
import { Modal, Button } from '../daisy/actions';
import { Loading } from '../daisy/feedback';
import type { ImportSummary } from '../../../main/projects';

interface ImportWizardModalProps {
  inProgress?: boolean;
  summary?: ImportSummary | null;
  onClose: () => void;
}

export default function ImportWizardModal({
  inProgress,
  summary,
  onClose,
}: ImportWizardModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (summary) closeRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (!summary) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [summary, onClose]);
  if (inProgress && !summary) {
    return (
      <Modal open className="flex flex-col items-center">
        <h3 className="font-bold text-lg mb-2">Importing...</h3>
        <Loading style="spinner" size="lg" />
      </Modal>
    );
  }

  if (summary) {
    const seconds = (summary.durationMs / 1000).toFixed(1);
    return (
      <Modal open onClose={onClose}>
        <h3 className="font-bold text-lg mb-2">Import Complete</h3>
        <p>
          Imported {summary.fileCount} files into {summary.name}
        </p>
        <p>{seconds} seconds</p>
        <div className="modal-action">
          <Button ref={closeRef} onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
