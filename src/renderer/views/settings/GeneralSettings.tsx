import React, { useEffect, useState } from 'react';
import { useToast } from '../../components/providers/ToastProvider';

export default function GeneralSettings() {
  const [editor, setEditor] = useState('');
  const [exportDir, setExportDir] = useState('');
  const [openLast, setOpenLast] = useState(true);
  const toast = useToast();

  useEffect(() => {
    window.electronAPI?.getTextureEditor().then((p) => setEditor(p));
    window.electronAPI?.getDefaultExportDir().then((d) => setExportDir(d));
    window.electronAPI?.getOpenLastProject().then((f) => setOpenLast(f));
  }, []);

  const saveEditor = () => {
    window.electronAPI
      ?.setTextureEditor(editor)
      .then(() => toast({ message: 'Editor path saved', type: 'success' }))
      .catch(() =>
        toast({ message: 'Failed to save editor path', type: 'error' })
      );
  };

  const saveExportDir = () => {
    window.electronAPI
      ?.setDefaultExportDir(exportDir)
      .then(() => toast({ message: 'Export directory saved', type: 'success' }))
      .catch(() =>
        toast({ message: 'Failed to save export directory', type: 'error' })
      );
  };

  const toggleOpenLast = async () => {
    const next = !openLast;
    setOpenLast(next);
    await window.electronAPI?.setOpenLastProject(next);
    toast({ message: 'Preference saved', type: 'success' });
  };

  return (
    <>
      <div className="form-control max-w-md">
        <label className="label" htmlFor="editor-path">
          <span className="label-text">External texture editor</span>
        </label>
        <input
          id="editor-path"
          className="input input-bordered"
          type="text"
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
        />
        <button className="btn btn-primary btn-sm mt-2" onClick={saveEditor}>
          Save
        </button>
      </div>
      <div className="form-control max-w-md mt-4">
        <label className="label" htmlFor="export-dir">
          <span className="label-text">Default export folder</span>
        </label>
        <input
          id="export-dir"
          className="input input-bordered"
          type="text"
          value={exportDir}
          onChange={(e) => setExportDir(e.target.value)}
        />
        <button className="btn btn-primary btn-sm mt-2" onClick={saveExportDir}>
          Save
        </button>
      </div>
      <div className="form-control max-w-md mt-4">
        <label className="cursor-pointer label" htmlFor="open-last-toggle">
          <span className="label-text">
            Open the most recently used project on startup
          </span>
          <input
            id="open-last-toggle"
            type="checkbox"
            className="toggle"
            checked={openLast}
            onChange={toggleOpenLast}
          />
        </label>
      </div>
    </>
  );
}
