export const INTAKE_PAGE_COPY = {
  backAria: "Voltar",
  title: "Entrada no estoque",
  subtitle: "Escolha uma das opções",
  nfValidated: "QR da nota validado. Em breve abrimos a revisão com os itens.",
  nfParseError: "Não foi possível ler a nota",
  nfEmptyError: "A nota não retornou itens para revisar. Tente a foto do cupom.",
  textLabel: "O que você comprou?",
  textPlaceholder: "Ex.: 2kg arroz, 1 leite, 500g feijão",
  textHint: "Digite ou use o microfone. Depois revise os itens.",
  submit: "Revisar itens",
  submitAria: "Revisar itens",
  parseError: "Não foi possível interpretar o texto",
  photoParseError: "Não foi possível ler o cupom",
  photoEmptyError:
    "A leitura não retornou itens para revisar. Tente outra foto ou use texto.",
  readingReceipt: "Lendo cupom…",
  stockOutPrompt: "Quer dar baixa?",
  stockOutLink: "Baixa por texto ou voz",
  draftsTitle: "Rascunhos salvos",
  draftsLoadError: "Erro ao carregar rascunhos",
  draftUntitled: "Entrada sem título",
  draftPhotoTitle: "Cupom (foto)",
  draftItems: (count) => `${count} item(ns)`,
  draftContinueAria: "Continuar rascunho",
  draftDiscardAria: "Descartar rascunho",
  draftDiscardTitle: "Descartar rascunho?",
  draftDiscardDescription: "O rascunho será removido e não poderá ser recuperado.",
  draftDiscardConfirm: "Descartar",
  draftDiscardCancel: "Manter",
  draftDiscarded: "Rascunho descartado",
  draftDiscardError: "Erro ao descartar rascunho",
  clearDrafts: "Limpar rascunhos",
  clearDraftsTitle: "Limpar todos os rascunhos?",
  clearDraftsDescription:
    "Todos os rascunhos de entrada serão descartados. Essa ação não pode ser desfeita.",
  clearDraftsConfirm: "Limpar",
  clearDraftsCancel: "Manter",
  clearDraftsSuccess: "Rascunhos limpos",
  clearDraftsError: "Erro ao limpar rascunhos",
};

export function formatIntakeDraftTitle(draft) {
  const store = String(draft?.storeName || "").trim();
  if (store) return store;
  if (draft?.source === "receipt_photo") {
    const raw = String(draft?.rawInput || "").trim();
    if (raw && !/\.(jpe?g|png|webp)$/i.test(raw)) return raw;
    return INTAKE_PAGE_COPY.draftPhotoTitle;
  }
  const raw = String(draft?.rawInput || "").trim().replace(/\s+/g, " ");
  if (!raw) return INTAKE_PAGE_COPY.draftUntitled;
  return raw.length > 72 ? `${raw.slice(0, 72)}…` : raw;
}

export function formatIntakeDraftUpdatedAt(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}
