import React, { useEffect, useState } from 'react';
import ExternalLink from '../components/ExternalLink';

export default function SettingsView() {
  const [editor, setEditor] = useState('');

  useEffect(() => {
    window.electronAPI?.getTextureEditor().then((p) => setEditor(p));
  }, []);

  const saveEditor = () => {
    window.electronAPI?.setTextureEditor(editor);
  };
  return (
    <section className="p-4" data-testid="settings-view">
      <div className="flex items-center mb-2 gap-2">
        <h2 className="font-display text-xl flex-1">Settings</h2>
        <ExternalLink
          href="https://minecraft.wiki/w/Options"
          aria-label="Help"
          className="btn btn-circle btn-ghost btn-sm"
        >
          ?
        </ExternalLink>
      </div>
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
    </section>
  );
}
