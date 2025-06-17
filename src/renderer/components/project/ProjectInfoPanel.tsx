import React, { useEffect, useState } from 'react';
import path from 'path';
import type { PackMeta } from '../../../main/projects';
import { Button } from '../daisy/actions';
import PackMetaModal from '../modals/PackMetaModal';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack replaces import with URL string
import defaultIcon from '../../../../resources/default_pack.png';

import { useProject } from '../providers/ProjectProvider';

interface Props {
  onExport: () => void;
  onBack: () => void;
  onSettings: () => void;
}

export default function ProjectInfoPanel({
  onExport,
  onBack,
  onSettings,
}: Props) {
  const { path: projectPath } = useProject();
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [edit, setEdit] = useState(false);
  const name = path.basename(projectPath);

  useEffect(() => {
    window.electronAPI?.loadPackMeta(name).then(setMeta);
  }, [name]);

  return (
    <>
      <div className="card bg-base-100 shadow" data-testid="project-info">
        <div className="card-body items-center gap-2 p-2">
          <Button className="link link-primary self-start" onClick={onBack}>
            Back to Projects
          </Button>
          <Button className="link link-primary self-start" onClick={onSettings}>
            Settings
          </Button>
          <img
            src="asset://pack.png"
            alt="Pack icon"
            className="w-24 h-24"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                defaultIcon as unknown as string;
            }}
          />
          <h2 className="card-title text-lg font-display">{name}</h2>
          <p className="text-xs break-all">{projectPath}</p>
          <p
            className="text-sm text-center break-all flex-1 cursor-pointer hover:underline"
            onClick={() => meta && setEdit(true)}
          >
            {meta?.description}
          </p>
          <div className="card-actions justify-end w-full mt-auto">
            <Button
              className="btn-neutral btn-sm"
              onClick={() => window.electronAPI?.openInFolder(projectPath)}
            >
              Open Folder
            </Button>
            <Button className="btn-accent btn-sm" onClick={onExport}>
              Export Pack
            </Button>
          </div>
        </div>
      </div>
      {edit && meta && (
        <PackMetaModal
          project={name}
          meta={meta}
          onCancel={() => setEdit(false)}
          onSave={(m) => {
            window.electronAPI?.savePackMeta(name, m).then(() => {
              setMeta(m);
              setEdit(false);
            });
          }}
        />
      )}
    </>
  );
}
