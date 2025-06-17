import React, { useEffect, useState } from 'react';
import { Modal, Button } from '../daisy/actions';
import { Loading } from '../daisy/feedback';
import { useProject } from '../providers/ProjectProvider';

export default function AtlasViewer({
  textures,
  onClose,
}: {
  textures: string[];
  onClose: () => void;
}) {
  const { path: projectPath } = useProject();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!projectPath) return;
    setUrl(null);
    window.electronAPI
      ?.createAtlas(projectPath, textures)
      .then((u) => setUrl(u))
      .catch(() => setUrl(null));
  }, [projectPath, textures]);

  return (
    <Modal open className="max-w-3xl">
      <h3 className="font-bold text-lg mb-2">Atlas Viewer</h3>
      {url ? (
        <img
          src={url}
          alt="atlas"
          className="w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div data-testid="spinner" className="flex justify-center p-4">
          <Loading />
        </div>
      )}
      <div className="modal-action">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
