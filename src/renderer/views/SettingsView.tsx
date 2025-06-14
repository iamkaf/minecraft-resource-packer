import React, { useEffect, useState } from 'react';
import ExternalLink from '../components/ExternalLink';
import { applyTheme, Theme } from '../utils/theme';

export default function SettingsView() {
  const [editor, setEditor] = useState('');
  const [theme, setTheme] = useState<Theme>('system');
  const [confetti, setConfetti] = useState(true);
  const [exportDir, setExportDir] = useState('');

  useEffect(() => {
    window.electronAPI?.getTextureEditor().then((p) => setEditor(p));
    window.electronAPI?.getTheme().then((t) => {
      setTheme(t);
    });
    window.electronAPI?.getConfetti().then((c) => setConfetti(c));
    window.electronAPI?.getDefaultExportDir().then((d) => setExportDir(d));
  }, []);

  const saveEditor = () => {
    window.electronAPI?.setTextureEditor(editor);
  };

  const updateTheme = async (t: Theme) => {
    setTheme(t);
    await window.electronAPI?.setTheme(t);
    applyTheme(t);
  };

  const saveExportDir = () => {
    window.electronAPI?.setDefaultExportDir(exportDir);
  };

  const toggleConfetti = async () => {
    const next = !confetti;
    setConfetti(next);
    await window.electronAPI?.setConfetti(next);
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
        <label className="label" htmlFor="theme-select">
          <span className="label-text">Theme</span>
        </label>
        <select
          id="theme-select"
          className="select select-bordered"
          value={theme}
          onChange={(e) => updateTheme(e.target.value as Theme)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div className="form-control max-w-md mt-4">
        <label className="cursor-pointer label" htmlFor="confetti-toggle">
          <span className="label-text">Confetti effects</span>
          <input
            id="confetti-toggle"
            type="checkbox"
            className="toggle"
            checked={confetti}
            onChange={toggleConfetti}
          />
        </label>
      </div>
    </section>
  );
}
