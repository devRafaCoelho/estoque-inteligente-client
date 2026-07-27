/**
 * Reduz foto de nota para upload/OCR (evita timeout e payload grande na API hospedada).
 *
 * @param {File|Blob} file
 * @param {{
 *   maxEdge?: number,
 *   quality?: number,
 *   maxBytes?: number,
 *   mimeType?: string,
 * }} [options]
 * @returns {Promise<File>}
 */
export async function compressReceiptImage(file, options = {}) {
  if (!file || typeof createImageBitmap !== "function") {
    return file;
  }

  const maxEdge = options.maxEdge ?? 1600;
  const quality = options.quality ?? 0.82;
  const maxBytes = options.maxBytes ?? 1.5 * 1024 * 1024;
  const outType = options.mimeType || "image/jpeg";

  // Já pequena o bastante — evita trabalho extra.
  if (file.size <= maxBytes && file.type === "image/jpeg") {
    return file instanceof File ? file : new File([file], "nota.jpg", { type: outType });
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, outType, quality);
    if (blob && blob.size > maxBytes && quality > 0.55) {
      blob = await canvasToBlob(canvas, outType, 0.65);
    }
    if (!blob) return file;

    const baseName = String(file.name || "nota")
      .replace(/\.[^.]+$/, "")
      .trim() || "nota";
    return new File([blob], `${baseName}.jpg`, {
      type: outType,
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close?.();
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} type
 * @param {number} quality
 * @returns {Promise<Blob|null>}
 */
function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
