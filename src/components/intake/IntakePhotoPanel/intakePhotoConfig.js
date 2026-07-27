export const INTAKE_PHOTO_CONFIG = {
  accept: "image/jpeg,image/png,image/webp",
  acceptList: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 8 * 1024 * 1024,
  cameraCapture: "environment",
  /** Tempo máximo aguardando OCR/visão no client (F2-4.5). */
  parseTimeoutMs: 90_000,
};

export const INTAKE_PHOTO_COPY = {
  title: "Foto do cupom",
  hint: "Tire uma foto ou escolha da galeria. Depois revise os itens.",
  camera: "Câmera",
  gallery: "Galeria",
  qr: "QR",
  qrDisabledHint: "Leitura de QR da nota em breve",
  change: "Trocar foto",
  submit: "Ler cupom",
  retry: "Tentar de novo",
  useText: "Usar texto",
  reading: "Lendo cupom…",
  clearAria: "Remover foto",
  previewAlt: "Prévia do cupom",
  errorTitle: "Não deu para ler",
  invalidType: "Use imagem JPG, PNG ou WebP",
  tooLarge: "Imagem muito grande (máximo 8 MB)",
  parseError: "Não foi possível ler o cupom",
};
