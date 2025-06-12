export const toggleTheme = () => {
  const root = document.documentElement;
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  root.classList.toggle('dark');
  localStorage.setItem('theme', next);
};
