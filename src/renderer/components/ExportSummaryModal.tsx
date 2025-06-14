import React from 'react';
import { ExportSummary } from '../../main/exporter';

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
    <dialog className="modal modal-open" data-testid="export-summary">
      <div className="modal-box">
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
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
