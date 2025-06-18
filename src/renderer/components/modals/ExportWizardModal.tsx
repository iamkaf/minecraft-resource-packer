import React, { useEffect, useRef } from 'react';
import { Modal, Button } from '../daisy/actions';
import { RadialProgress } from '../daisy/feedback';
import type { ExportSummary } from '../../../main/exporter';

export interface BulkProgress {
  current: number;
  total: number;
}

interface ExportWizardModalProps {
  progress?: BulkProgress | null;
  summary?: ExportSummary | null;
  onClose: () => void;
  onOpenFolder?: () => void;
}

export default function ExportWizardModal({
  progress,
  summary,
  onClose,
  onOpenFolder,
}: ExportWizardModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (summary) closeRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (!summary) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [summary, onClose]);
  if (progress && !summary) {
    const percent = progress.total
      ? Math.floor((progress.current / progress.total) * 100)
      : 15;
    return (
      <Modal open className="flex flex-col items-center">
        <h3 className="font-bold text-lg mb-2">Exporting...</h3>
        <RadialProgress value={percent} size="5rem" />
        {progress.total > 0 && (
          <p className="mt-2">
            {progress.current}/{progress.total}
          </p>
        )}
      </Modal>
    );
  }

  if (summary) {
    const sizeMB = (summary.totalSize / (1024 * 1024)).toFixed(2);
    const seconds = (summary.durationMs / 1000).toFixed(1);
    return (
      <Modal open>
        <h3 className="font-bold text-lg mb-2">Export Complete</h3>
        <p>
          {summary.fileCount} files, {sizeMB} MB
        </p>
        <p>{seconds} seconds</p>
        {summary.warnings.length > 0 && (
          <ul className="mt-2">
            {summary.warnings.map((w: string, i: number) => (
              <li key={i} className="text-warning">
                {w}
              </li>
            ))}
          </ul>
        )}
        <div className="modal-action">
          {onOpenFolder && (
            <Button className="btn-secondary" onClick={onOpenFolder}>
              Open Folder
            </Button>
          )}
          <Button ref={closeRef} onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return null;
}
