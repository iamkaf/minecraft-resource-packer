import React from 'react';
import { Button } from '../daisy/actions';
import { useAppStore } from '../../store';

export default function ExporterTab({ onExport }: { onExport: () => void }) {
  const projectPath = useAppStore((s) => s.projectPath);
  return (
    <div className="p-4 flex flex-col gap-2" data-testid="exporter-tab">
      <p>{projectPath}</p>
      <Button className="btn-primary self-start" onClick={onExport}>
        Export Pack
      </Button>
    </div>
  );
}
