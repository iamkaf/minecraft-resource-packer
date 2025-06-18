import React from 'react';
import ExportWizardModal, {
  BulkProgress,
} from '../../components/modals/ExportWizardModal';
import type { ExportSummary } from '../../../main/exporter';

interface Props {
  progress: BulkProgress | null;
  summary: ExportSummary | null;
  onClose: () => void;
}

export default function ExporterTab({ progress, summary, onClose }: Props) {
  if (!progress && !summary)
    return <div className="p-4">No export running</div>;
  return (
    <ExportWizardModal
      progress={progress ?? undefined}
      summary={summary ?? undefined}
      onClose={onClose}
    />
  );
}
