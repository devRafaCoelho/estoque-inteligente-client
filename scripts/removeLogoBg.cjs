const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function removeBlackBackground(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const px = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isBg = (i) => {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    return r < 22 && g < 22 && b < 22;
  };

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * channels;
    if (!isBg(i)) return;
    visited[idx] = 1;
    queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width;
    const y = (idx / width) | 0;
    const i = idx * channels;
    px[i + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const i = idx * channels;
      if (px[i + 3] === 0) continue;
      if (!isBg(i)) continue;
      let nearClear = false;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const ni = ((y + dy) * width + (x + dx)) * channels;
        if (px[ni + 3] === 0) nearClear = true;
      }
      if (nearClear) px[i + 3] = 0;
    }
  }

  await sharp(px, { raw: { width, height, channels } }).png().toFile(output);
  console.log("OK", path.basename(output), `${width}x${height}`);
}

(async () => {
  const assets = path.join(__dirname, "..", "src", "assets");
  const publicDir = path.join(__dirname, "..", "public");
  const tmpIcon = path.join(assets, "_tmp-icon.png");
  const tmpLogo = path.join(assets, "_tmp-logo.png");
  const iconOut = path.join(assets, "brand-icon.png");
  const logoOut = path.join(assets, "brand-logo.png");

  fs.copyFileSync(iconOut, tmpIcon);
  fs.copyFileSync(logoOut, tmpLogo);
  await removeBlackBackground(tmpIcon, iconOut);
  await removeBlackBackground(tmpLogo, logoOut);
  fs.copyFileSync(iconOut, path.join(publicDir, "favicon.png"));
  fs.unlinkSync(tmpIcon);
  fs.unlinkSync(tmpLogo);
  console.log("done");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
