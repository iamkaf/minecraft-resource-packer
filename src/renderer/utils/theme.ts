export type Theme = 'light' | 'dark' | 'system';

export function applyTheme(t: Theme): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const actual = t === 'system' ? (prefersDark ? 'dark' : 'light') : t;
  const name = actual === 'light' ? 'light' : 'minecraft';
  document.documentElement.setAttribute('data-theme', name);
}

export async function toggleTheme(): Promise<void> {
  const current = await window.electronAPI?.getTheme();
  let next: Theme = 'light';
  if (current === 'light') next = 'dark';
  else if (current === 'dark') next = 'light';
  else {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    next = prefersDark ? 'light' : 'dark';
  }
  await window.electronAPI?.setTheme(next);
  applyTheme(next);
}
