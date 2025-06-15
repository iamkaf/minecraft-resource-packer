import React, { useEffect, useState } from 'react';
import ExternalLink from '../components/ExternalLink';

export default function SettingsView() {
  const [editor, setEditor] = useState('');
  const [confettiEnabled, setConfettiEnabled] = useState(true);

  useEffect(() => {
    window.electronAPI?.getTextureEditor().then((p) => setEditor(p));
    window.electronAPI?.getConfettiEnabled().then((v) => setConfettiEnabled(v));
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
      <div className="form-control max-w-md mt-4">
        <label className="label cursor-pointer" htmlFor="confetti-toggle">
          <span className="label-text">Show confetti on export</span>
          <input
            id="confetti-toggle"
            type="checkbox"
            className="toggle"
            checked={confettiEnabled}
            onChange={(e) => {
              const flag = e.target.checked;
              setConfettiEnabled(flag);
              window.electronAPI?.setConfettiEnabled(flag);
            }}
          />
        </label>
      </div>
    </section>
  );
}
