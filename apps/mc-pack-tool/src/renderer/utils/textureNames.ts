export function formatTextureName(file: string): string {
  const base = file.split('/').pop() ?? file;
  const name = base.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
