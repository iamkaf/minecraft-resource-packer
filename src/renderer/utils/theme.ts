export const toggleTheme = () => {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') ?? 'minecraft';
  const next = current === 'minecraft' ? 'light' : 'minecraft';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};
