// Derives web-ready brand assets from the supplied logo JPEG.
// Usage: node scripts/prepare-brand-assets.mjs
// Re-run whenever public/brand/medhavya-logo-full.jpeg is replaced with an approved file.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/brand/medhavya-logo-full.jpeg");
const out = (p) => path.join(root, p);

// Converts near-white pixels to transparency with a soft edge so the mark sits on any surface.
async function knockOutWhite(input) {
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min > 245) data[i + 3] = 0;
    else if (min > 215) data[i + 3] = Math.round(((245 - min) / 30) * 255);
  }
  return sharp(data, { raw: info });
}

// Symbol: the circular "M" mark with the star (region measured on the 1536x1024 source).
const symbolRegion = { left: 440, top: 55, width: 660, height: 560 };
const symbol = await knockOutWhite(sharp(src).extract(symbolRegion));
const symbolPng = await symbol.png().toBuffer();
const trimmed = sharp(symbolPng).trim({ threshold: 1 });
await trimmed.clone().resize({ height: 192 }).png().toFile(out("public/brand/medhavya-mark.png"));

// Full lockup with transparent background for light or dark placement.
const full = await knockOutWhite(sharp(src));
await sharp(await full.png().toBuffer())
  .trim({ threshold: 1 })
  .resize({ width: 960 })
  .png()
  .toFile(out("public/brand/medhavya-logo-full.png"));

// App icons (square, padded on white for legibility in browser chrome).
const square = async (size, file) =>
  sharp({ create: { width: size, height: size, channels: 4, background: "#FFFFFF" } })
    .composite([{ input: await sharp(symbolPng).trim({ threshold: 1 }).resize({ width: Math.round(size * 0.84), height: Math.round(size * 0.84), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), gravity: "center" }])
    .png()
    .toFile(out(file));

await square(512, "src/app/icon.png");
await square(180, "src/app/apple-icon.png");
console.log("Brand assets written.");
