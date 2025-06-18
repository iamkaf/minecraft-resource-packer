import React, { useEffect, useState } from 'react';
import { applyTheme, Theme } from '../../utils/theme';
import { useToast } from '../../components/providers/ToastProvider';

export default function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>('system');
  const [confetti, setConfetti] = useState(true);
  const toast = useToast();

  useEffect(() => {
    window.electronAPI?.getTheme().then(setTheme);
    window.electronAPI?.getConfetti().then(setConfetti);
  }, []);

  const updateTheme = async (t: Theme) => {
    setTheme(t);
    await window.electronAPI?.setTheme(t);
    applyTheme(t);
    toast({ message: 'Theme updated', type: 'success' });
  };

  const toggleConfetti = async () => {
    const next = !confetti;
    setConfetti(next);
    await window.electronAPI?.setConfetti(next);
    toast({ message: 'Preference saved', type: 'success' });
  };

  return (
    <>
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
    </>
  );
}
