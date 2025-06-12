export interface VersionRange {
	min: string;
	max: string;
	format: number;
}

// Table derived from https://minecraft.wiki/w/Pack_format
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
];

function parse(ver: string): number[] {
	return ver.split('.').map(n => parseInt(n, 10));
}

function compare(a: number[], b: number[]): number {
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const av = a[i] ?? 0;
		const bv = b[i] ?? 0;
		if (av > bv) return 1;
		if (av < bv) return -1;
	}
	return 0;
}

function between(ver: string, min: string, max: string): boolean {
	const v = parse(ver);
	return compare(v, parse(min)) >= 0 && compare(v, parse(max)) <= 0;
}

export function packFormatForVersion(ver: string): number | null {
	for (const r of PACK_FORMATS) {
		if (between(ver, r.min, r.max)) return r.format;
	}
	return null;
}
