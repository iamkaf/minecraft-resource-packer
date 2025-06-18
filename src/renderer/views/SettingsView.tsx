import React, { useEffect, useState } from 'react';
import ExternalLink from '../components/common/ExternalLink';
import { applyTheme, Theme } from '../utils/theme';
import { useToast } from '../components/providers/ToastProvider';
import { Kbd } from '../components/daisy/display';

export default function SettingsView() {
  const [editor, setEditor] = useState('');
  const [theme, setTheme] = useState<Theme>('system');
  const [confetti, setConfetti] = useState(true);
  const [openLast, setOpenLast] = useState(true);
  const [exportDir, setExportDir] = useState('');
  const toast = useToast();

  useEffect(() => {
    window.electronAPI?.getTextureEditor().then((p) => setEditor(p));
    window.electronAPI?.getTheme().then((t) => {
      setTheme(t);
    });
    window.electronAPI?.getConfetti().then((c) => setConfetti(c));
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

  const updateTheme = async (t: Theme) => {
    setTheme(t);
    await window.electronAPI?.setTheme(t);
    applyTheme(t);
    toast({ message: 'Theme updated', type: 'success' });
  };

  const saveExportDir = () => {
    window.electronAPI
      ?.setDefaultExportDir(exportDir)
      .then(() => toast({ message: 'Export directory saved', type: 'success' }))
      .catch(() =>
        toast({ message: 'Failed to save export directory', type: 'error' })
      );
  };

  const toggleConfetti = async () => {
    const next = !confetti;
    setConfetti(next);
    await window.electronAPI?.setConfetti(next);
    toast({ message: 'Preference saved', type: 'success' });
  };

  const toggleOpenLast = async () => {
    const next = !openLast;
    setOpenLast(next);
    await window.electronAPI?.setOpenLastProject(next);
    toast({ message: 'Preference saved', type: 'success' });
  };
  return (
    <section className="flex gap-4" data-testid="settings-view">
      <div className="flex-1 p-4">
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

        <div id="general" className="mb-8">
          <h3 className="font-display text-lg mb-2">General</h3>
          <div className="form-control max-w-md">
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
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={saveExportDir}
            >
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
        </div>

        <div id="appearance" className="mb-8">
          <h3 className="font-display text-lg mb-2">Appearance</h3>
          <div className="form-control max-w-md">
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
        </div>

        <div id="editor" className="mb-8">
          <h3 className="font-display text-lg mb-2">External Editor</h3>
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
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={saveEditor}
            >
              Save
            </button>
          </div>
        </div>

        <div id="shortcuts" className="mb-8">
          <h3 className="font-display text-lg mb-2">Keyboard Shortcuts</h3>
          <p className="mb-2">The Project Manager supports:</p>
          <ul className="list-disc list-inside">
            <li>
              <Kbd>Enter</Kbd> – open all selected projects.
            </li>
            <li>
              <Kbd>Delete</Kbd> – remove all selected projects.
            </li>
          </ul>
        </div>
      </div>

      <aside className="w-64 p-4 bg-base-200 hidden md:block">
        <ul className="menu">
          <li>
            <a href="#general" className="rounded-btn">
              General
            </a>
          </li>
          <li>
            <a href="#appearance" className="rounded-btn">
              Appearance
            </a>
          </li>
          <li>
            <a href="#editor" className="rounded-btn">
              External Editor
            </a>
          </li>
          <li>
            <a href="#shortcuts" className="rounded-btn">
              Shortcuts
            </a>
          </li>
        </ul>
      </aside>
    </section>
  );
}
