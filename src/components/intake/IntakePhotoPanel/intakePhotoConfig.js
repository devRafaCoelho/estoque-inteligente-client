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
  hint: "Tire uma foto, escolha da galeria ou leia o QR da nota.",
  camera: "Câmera",
  gallery: "Galeria",
  qr: "QR da nota",
  qrDisabledHint: "Leitura de QR da nota em breve",
  openQr: "Abrir leitura de QR",
  sefazFallbackTitle: "Consulta à SEFAZ indisponível",
  sefazFallbackHint:
    "Não bloqueamos você: tire uma foto do cupom ou escolha da galeria para continuar pela leitura (OCR).",
  sefazFallbackCamera: "Tirar foto do cupom",
  sefazFallbackGallery: "Escolher da galeria",
  sefazFallbackRetryQr: "Tentar QR de novo",
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
