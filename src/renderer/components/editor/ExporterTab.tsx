import React from 'react';
import { Button } from '../daisy/actions';
import { useProject } from '../providers/ProjectProvider';

export default function ExporterTab({ onExport }: { onExport: () => void }) {
  const { path: projectPath } = useProject();
  return (
    <div className="p-4 flex flex-col gap-2" data-testid="exporter-tab">
      <p>{projectPath}</p>
      <Button className="btn-primary self-start" onClick={onExport}>
        Export Pack
      </Button>
    </div>
  );
}
