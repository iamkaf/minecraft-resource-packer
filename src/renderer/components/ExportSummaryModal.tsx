import React from 'react';
import { ExportSummary } from '../../main/exporter';
import { Modal, Button } from './daisy/actions';

export default function ExportSummaryModal({
  summary,
  onClose,
}: {
  summary: ExportSummary;
  onClose: () => void;
}) {
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
          {summary.warnings.map((w, i) => (
            <li key={i} className="text-warning">
              {w}
            </li>
          ))}
        </ul>
      )}
      <div className="modal-action">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
