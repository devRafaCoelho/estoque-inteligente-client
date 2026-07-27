export const INTAKE_PHOTO_CONFIG = {
  accept: "image/jpeg,image/png,image/webp",
  acceptList: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 8 * 1024 * 1024,
  cameraCapture: "environment",
  /** Tempo máximo aguardando OCR/visão no client (F2-4.5). */
  parseTimeoutMs: 90_000,
  /** Compactação antes do upload (API hospedada / Render). */
  compressMaxEdge: 1600,
  compressQuality: 0.82,
  compressMaxBytes: 1.5 * 1024 * 1024,
};

export const INTAKE_PHOTO_COPY = {
  title: "Foto da nota",
  hint: "Tire uma foto, escolha da galeria ou leia o QR da nota.",
  camera: "Câmera",
  gallery: "Galeria",
  qr: "QR da nota",
  qrDisabledHint: "Leitura de QR da nota em breve",
  openQr: "Abrir leitura de QR",
  sefazFallbackTitle: "Consulta à SEFAZ indisponível",
  sefazFallbackHint:
    "Não bloqueamos você: tire uma foto da nota ou escolha da galeria para continuar pela leitura (OCR).",
  sefazFallbackCamera: "Tirar foto da nota",
  sefazFallbackGallery: "Escolher da galeria",
  sefazFallbackRetryQr: "Tentar QR de novo",
  change: "Trocar foto",
  submit: "Ler nota",
  retry: "Tentar de novo",
  useText: "Usar texto",
  reading: "Lendo nota…",
  clearAria: "Remover foto",
  previewAlt: "Prévia da nota",
  errorTitle: "Não deu para ler",
  invalidType: "Use imagem JPG, PNG ou WebP",
  tooLarge: "Imagem muito grande (máximo 8 MB)",
  parseError: "Não foi possível ler a nota",
};
