export const INTAKE_NF_CONFIG = {
  facingMode: "environment",
};

export const INTAKE_NF_COPY = {
  scanning: "Aponte para o QR da nota…",
  reading: "Lendo nota…",
  scanAgain: "Escanear de novo",
  stopScan: "Cancelar",
  backToPhoto: "Voltar",
  usePhoto: "Usar foto do cupom",
  cameraDenied: "Não foi possível abrir a câmera. Use a foto do cupom.",
  scanError: "Não li um QR de nota válido. Tente de novo.",
  parseError: "Não foi possível ler a nota",
  errors: {
    empty: "QR vazio",
    notFound: "Não encontrei a chave de acesso nesse QR",
    length: "A chave de acesso precisa ter 44 dígitos",
    digits: "A chave de acesso deve conter só números",
    checkDigit: "Chave inválida (dígito verificador não confere)",
    state: "UF da chave não é reconhecida",
    model: "Só aceitamos NF-e (55) ou NFC-e (65)",
  },
};

export function nfPayloadErrorMessage(reason) {
  return INTAKE_NF_COPY.errors[reason] || INTAKE_NF_COPY.errors.notFound;
}
