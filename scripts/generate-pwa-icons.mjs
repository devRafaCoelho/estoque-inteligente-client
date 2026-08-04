/**
 * Gera ícones PWA com padding (safe zone) a partir de public/favicon.png.
 * Uso (com sharp instalado ou via npx):
 *   node scripts/generate-pwa-icons.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(root, "public", "favicon.png");
const bg = { r: 247, g: 244, b: 239, alpha: 1 };

async function makeIcon({ size, scale, out }) {
  const iconSide = Math.round(size * scale);
  const foreground = await sharp(src)
    .resize(iconSide, iconSide, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: foreground, gravity: "centre" }])
    .png()
    .toFile(out);

  console.log("wrote", path.relative(root, out), `${size}px`, `scale=${scale}`);
}

await makeIcon({
  size: 192,
  scale: 0.72,
  out: path.join(root, "public", "pwa-192.png"),
});
await makeIcon({
  size: 512,
  scale: 0.72,
  out: path.join(root, "public", "pwa-512.png"),
});
await makeIcon({
  size: 512,
  scale: 0.68,
  out: path.join(root, "public", "pwa-512-maskable.png"),
});
await makeIcon({
  size: 180,
  scale: 0.74,
  out: path.join(root, "public", "apple-touch-icon.png"),
});
