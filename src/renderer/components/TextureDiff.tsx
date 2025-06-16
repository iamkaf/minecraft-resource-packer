import React, { useEffect, useState } from 'react';
import { Modal, Button } from './daisy/actions';
import { Diff } from './daisy/display';
import { useProject } from './ProjectProvider';

export default function TextureDiff({
  asset,
  onClose,
}: {
  asset: string;
  onClose: () => void;
}) {
  const { path: projectPath } = useProject();
  const [vanilla, setVanilla] = useState<string | null>(null);

  useEffect(() => {
    setVanilla(null);
    window.electronAPI
      ?.getTextureUrl(projectPath, asset)
      .then((url) => setVanilla(url));
  }, [projectPath, asset]);

  if (!vanilla) return null;

  return (
    <Modal open>
      <h3 className="font-bold text-lg mb-2">Vanilla Comparison</h3>
      <Diff
        before={
          <img
            src={vanilla}
            alt="vanilla"
            style={{ imageRendering: 'pixelated' }}
          />
        }
        after={
          <img
            src={`asset://${asset}`}
            alt="project"
            style={{ imageRendering: 'pixelated' }}
          />
        }
      />
      <div className="modal-action">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
