import React from 'react';
import Spinner from './Spinner';

export interface BulkProgress {
  current: number;
  total: number;
}

export default function BulkExportModal({
  progress,
}: {
  progress: BulkProgress;
}) {
  return (
    <dialog className="modal modal-open" data-testid="bulk-export-modal">
      <div className="modal-box flex flex-col items-center">
        <h3 className="font-bold text-lg mb-2">Exporting...</h3>
        <Spinner />
        <p className="mt-2">
          {progress.current}/{progress.total}
        </p>
      </div>
    </dialog>
  );
}
