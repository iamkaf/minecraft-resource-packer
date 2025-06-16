import React from 'react';
import Spinner from './Spinner';
import { Modal } from './daisy/actions';

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
    <Modal open className="flex flex-col items-center">
      <h3 className="font-bold text-lg mb-2">Exporting...</h3>
      <Spinner />
      <p className="mt-2">
        {progress.current}/{progress.total}
      </p>
    </Modal>
  );
}
