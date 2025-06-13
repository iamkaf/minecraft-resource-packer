import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function generatePackIcon(
  seed: number,
  outPath: string
): Promise<void> {
  const rand = mulberry32(seed);
  const hue = Math.floor(rand() * 360);
  const pastel = `hsl(${hue},70%,90%)`;
  const borderColor = `hsl(${hue},30%,40%)`;

  const base = sharp({
    create: { width: 120, height: 120, channels: 4, background: pastel },
  });

  const spriteW = 32;
  const spriteH = 32;
  const spriteBuf = Buffer.alloc(spriteW * spriteH * 4, 0);
  for (let y = 0; y < spriteH; y++) {
    for (let x = 0; x < spriteW / 2; x++) {
      const on = rand() > 0.5;
      const r = Math.floor(rand() * 255);
      const g = Math.floor(rand() * 255);
      const b = Math.floor(rand() * 255);
      for (const xx of [x, spriteW - x - 1]) {
        const idx = (y * spriteW + xx) * 4;
        spriteBuf[idx] = r;
        spriteBuf[idx + 1] = g;
        spriteBuf[idx + 2] = b;
        spriteBuf[idx + 3] = on ? 255 : 0;
      }
    }
  }
  const spriteImg = await sharp(spriteBuf, {
    raw: { width: spriteW, height: spriteH, channels: 4 },
  })
    .png()
    .toBuffer();

  await base
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: borderColor })
    .composite([
      {
        input: spriteImg,
        top: Math.floor((128 - spriteH) / 2),
        left: Math.floor((128 - spriteW) / 2),
      },
    ])
    .png()
    .toFile(outPath);
}

export interface ProjectSettings {
  iconSeed: number;
}

export function writeSettings(dir: string, settings: ProjectSettings): void {
  fs.writeFileSync(
    path.join(dir, 'settings.json'),
    JSON.stringify(settings, null, 2)
  );
}
