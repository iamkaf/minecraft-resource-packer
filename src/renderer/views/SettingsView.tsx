import React, { useEffect, useState } from 'react';
import ExternalLink from '../components/common/ExternalLink';
import { applyTheme, Theme } from '../utils/theme';
import { useToast } from '../components/providers/ToastProvider';
import { Menu } from '../components/daisy/navigation';
import { Kbd } from '../components/daisy/display';

export default function SettingsView() {
  const [editor, setEditor] = useState('');
  const [theme, setTheme] = useState<Theme>('system');
  const [confetti, setConfetti] = useState(true);
  const [openLast, setOpenLast] = useState(true);
  const [exportDir, setExportDir] = useState('');
  const [tab, setTab] = useState<'general' | 'appearance' | 'shortcuts'>(
    'general'
  );
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
    <section className="p-4 flex gap-4" data-testid="settings-view">
      <aside className="w-48">
        <Menu className="bg-base-200 rounded-box" data-testid="settings-nav">
          <li>
            <button
              type="button"
              className={tab === 'general' ? 'active' : ''}
              onClick={() => setTab('general')}
            >
              General
            </button>
          </li>
          <li>
            <button
              type="button"
              className={tab === 'appearance' ? 'active' : ''}
              onClick={() => setTab('appearance')}
            >
              Appearance
            </button>
          </li>
          <li>
            <button
              type="button"
              className={tab === 'shortcuts' ? 'active' : ''}
              onClick={() => setTab('shortcuts')}
            >
              Keyboard Shortcuts
            </button>
          </li>
        </Menu>
      </aside>
      <div className="flex-1">
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
        {tab === 'general' && (
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
        )}
        {tab === 'general' && (
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
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={saveExportDir}
            >
              Save
            </button>
          </div>
        )}
        {tab === 'appearance' && (
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
        )}
        {tab === 'appearance' && (
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
        )}
        {tab === 'general' && (
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
        )}
        {tab === 'shortcuts' && (
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Project Manager</h3>
            <ul className="list-disc list-inside">
              <li>
                <Kbd>Enter</Kbd> – open all selected projects
              </li>
              <li>
                <Kbd>Delete</Kbd> – remove all selected projects
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
