export interface VersionRange {
  min: string;
  max: string;
  format: number;
}

// Tables derived from https://minecraft.wiki/w/Pack_format on 2025-06-12
// Release versions
export const PACK_FORMATS: VersionRange[] = [
  { min: '1.6.1', max: '1.8.9', format: 1 },
  { min: '1.9', max: '1.10.2', format: 2 },
  { min: '1.11', max: '1.12.2', format: 3 },
  { min: '1.13', max: '1.14.4', format: 4 },
  { min: '1.15', max: '1.16.1', format: 5 },
  { min: '1.16.2', max: '1.16.5', format: 6 },
  { min: '1.17', max: '1.17.1', format: 7 },
  { min: '1.18', max: '1.18.2', format: 8 },
  { min: '1.19', max: '1.19.2', format: 9 },
  { min: '1.19.3', max: '1.19.3', format: 12 },
  { min: '1.19.4', max: '1.19.4', format: 13 },
  { min: '1.20', max: '1.20.1', format: 15 },
  { min: '1.20.2', max: '1.20.2', format: 18 },
  { min: '1.20.3', max: '1.20.4', format: 22 },
  { min: '1.20.5', max: '1.20.6', format: 32 },
  { min: '1.21', max: '1.21.1', format: 34 },
  { min: '1.21.2', max: '1.21.3', format: 42 },
  { min: '1.21.4', max: '1.21.4', format: 46 },
  { min: '1.21.5', max: '1.21.5', format: 55 },
];

// Snapshot versions
export const SNAPSHOT_FORMATS: VersionRange[] = [
  { min: '16w32a', max: '17w47b', format: 3 },
  { min: '17w48a', max: '19w46b', format: 4 },
  { min: '1.15-pre1', max: '1.16-pre3', format: 5 },
  { min: '1.16.2-rc1', max: '1.16.5', format: 6 },
  { min: '20w45a', max: '21w38a', format: 7 },
  { min: '21w39a', max: '1.18.2', format: 8 },
  { min: '22w11a', max: '1.19.2', format: 9 },
  { min: '22w42a', max: '22w44a', format: 11 },
  { min: '22w45a', max: '23w07a', format: 12 },
  { min: '1.19.4-pre1', max: '23w13a', format: 13 },
  { min: '23w14a', max: '23w16a', format: 14 },
  { min: '23w17a', max: '1.20.1', format: 15 },
  { min: '23w31a', max: '23w31a', format: 16 },
  { min: '23w32a', max: '1.20.2-pre1', format: 17 },
  { min: '1.20.2-pre2', max: '23w41a', format: 18 },
  { min: '23w42a', max: '23w42a', format: 19 },
  { min: '23w43a', max: '23w44a', format: 20 },
  { min: '23w45a', max: '23w46a', format: 21 },
  { min: '1.20.3-pre1', max: '23w51b', format: 22 },
  { min: '24w03a', max: '24w04a', format: 24 },
  { min: '24w05a', max: '24w05b', format: 25 },
  { min: '24w06a', max: '24w07a', format: 26 },
  { min: '24w09a', max: '24w10a', format: 28 },
  { min: '24w11a', max: '24w11a', format: 29 },
  { min: '24w12a', max: '24w12a', format: 30 },
  { min: '24w13a', max: '1.20.5-pre3', format: 31 },
  { min: '1.20.5-pre4', max: '1.20.6', format: 32 },
  { min: '24w18a', max: '24w20a', format: 33 },
  { min: '24w21a', max: '1.21.1', format: 34 },
  { min: '24w33a', max: '24w33a', format: 35 },
  { min: '24w34a', max: '24w35a', format: 36 },
  { min: '24w36a', max: '24w36a', format: 37 },
  { min: '24w37a', max: '24w37a', format: 38 },
  { min: '24w38a', max: '24w39a', format: 39 },
  { min: '24w40a', max: '24w40a', format: 40 },
  { min: '1.21.2-pre1', max: '1.21.2-pre2', format: 41 },
  { min: '1.21.2-pre3', max: '1.21.3', format: 42 },
  { min: '24w44a', max: '24w44a', format: 43 },
  { min: '24w45a', max: '24w45a', format: 44 },
  { min: '24w46a', max: '24w46a', format: 45 },
  { min: '1.21.4-pre1', max: '1.21.4', format: 46 },
  { min: '25w02a', max: '25w02a', format: 47 },
  { min: '25w03a', max: '25w03a', format: 48 },
  { min: '25w04a', max: '25w04a', format: 49 },
  { min: '25w05a', max: '25w05a', format: 50 },
  { min: '25w06a', max: '25w06a', format: 51 },
  { min: '25w07a', max: '25w07a', format: 52 },
  { min: '25w08a', max: '25w09b', format: 53 },
  { min: '25w10a', max: '25w10a', format: 54 },
  { min: '1.21.5-pre1', max: '1.21.5', format: 55 },
  { min: '25w15a', max: '25w15a', format: 56 },
  { min: '25w16a', max: '25w16a', format: 57 },
  { min: '25w17a', max: '25w17a', format: 58 },
  { min: '25w18a', max: '25w18a', format: 59 },
  { min: '25w19a', max: '25w19a', format: 60 },
  { min: '25w20a', max: '25w20a', format: 61 },
  { min: '25w21a', max: '25w21a', format: 62 },
];

// ----- Release version helpers -----
// Release versions follow the typical "major.minor.patch" pattern. These helpers
// parse and compare them numerically so we can determine if a given release is
// within a range from the PACK_FORMATS table.
function parseRelease(ver: string): number[] {
  return ver.split('.').map((n) => parseInt(n, 10));
}

function compareRelease(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }
  return 0;
}

function betweenRelease(ver: string, min: string, max: string): boolean {
  const v = parseRelease(ver);
  return (
    compareRelease(v, parseRelease(min)) >= 0 &&
    compareRelease(v, parseRelease(max)) <= 0
  );
}

// Snapshots have a format like "24w11a" consisting of the year, week and a
// letter suffix. SNAP_RE matches this format for quick detection.
const SNAP_RE = /^(\d{2})w(\d{2})([a-z])$/i;

// ----- Snapshot version helpers -----
// Convert a snapshot string to [year, week, letterIndex] for comparison.
function parseSnapshot(ver: string): [number, number, number] | null {
  const m = SNAP_RE.exec(ver);
  if (!m) return null;
  return [
    parseInt(m[1], 10),
    parseInt(m[2], 10),
    m[3].toLowerCase().charCodeAt(0) - 97,
  ];
}

function compareSnapshot(
  a: [number, number, number],
  b: [number, number, number]
): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return 0;
}

function betweenSnapshot(ver: string, min: string, max: string): boolean {
  const v = parseSnapshot(ver);
  const mi = parseSnapshot(min);
  const ma = parseSnapshot(max);
  if (!v || !mi || !ma) return false;
  return compareSnapshot(v, mi) >= 0 && compareSnapshot(v, ma) <= 0;
}

// Determine the pack format number for a given Minecraft version. Snapshot
// versions are matched against SNAPSHOT_FORMATS while releases use PACK_FORMATS.
export function packFormatForVersion(ver: string): number | null {
  if (SNAP_RE.test(ver)) {
    for (const r of SNAPSHOT_FORMATS) {
      if (betweenSnapshot(ver, r.min, r.max)) return r.format;
    }
  } else {
    for (const r of PACK_FORMATS) {
      if (betweenRelease(ver, r.min, r.max)) return r.format;
    }
  }
  return null;
}

export function versionRangeForFormat(format: number): VersionRange | null {
  return PACK_FORMATS.find((r) => r.format === format) ?? null;
}

export function versionForFormat(format: number): string | null {
  const range = versionRangeForFormat(format);
  return range ? range.max : null;
}

export function displayForFormat(format: number): string | null {
  const range = versionRangeForFormat(format);
  if (!range) return null;
  return range.min === range.max ? range.min : `${range.min} - ${range.max}`;
}

export interface PackFormatInfo {
  format: number;
  label: string;
}
