import React from 'react';
import { applyTheme, Theme } from '../../../utils/theme';

export default function ThemeController() {
  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyTheme(e.target.value as Theme);
  };
  return (
    <select
      className="select select-bordered"
      onChange={changeTheme}
      data-testid="theme-controller"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
