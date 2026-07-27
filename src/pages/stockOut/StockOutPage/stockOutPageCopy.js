export const STOCK_OUT_PAGE_COPY = {
  backAria: "Voltar",
  title: "Baixa no estoque",
  subtitle: "Descreva o que foi consumido em texto ou por voz",
  textLabel: "O que você usou?",
  textPlaceholder: "Ex.: dê baixa em 1 leite, 200g de queijo",
  submit: "Revisar itens",
  submitAria: "Revisar itens",
  parseError: "Não foi possível interpretar a baixa",
  intakePrompt: "Quer registrar uma compra?",
  intakeLink: "Entrada por texto ou voz",
  draftsTitle: "Rascunhos salvos",
  draftsLoadError: "Erro ao carregar rascunhos",
  draftUntitled: "Baixa sem título",
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
    "Todos os rascunhos de baixa serão descartados. Essa ação não pode ser desfeita.",
  clearDraftsConfirm: "Limpar",
  clearDraftsCancel: "Manter",
  clearDraftsSuccess: "Rascunhos limpos",
  clearDraftsError: "Erro ao limpar rascunhos",
};

export function formatStockOutDraftTitle(draft) {
  const raw = String(draft?.rawInput || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!raw) return STOCK_OUT_PAGE_COPY.draftUntitled;
  return raw.length > 72 ? `${raw.slice(0, 72)}…` : raw;
}

export function formatStockOutDraftUpdatedAt(value) {
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
