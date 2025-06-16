import React from 'react';
import { Modal } from './daisy/actions';
import { Loading } from './daisy/feedback';

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
      <div data-testid="spinner" className="p-4">
        <Loading />
      </div>
      <p className="mt-2">
        {progress.current}/{progress.total}
      </p>
    </Modal>
  );
}
