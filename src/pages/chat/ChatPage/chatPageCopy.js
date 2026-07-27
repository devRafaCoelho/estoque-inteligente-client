export const CHAT_PAGE_COPY = {
  title: "Assistente",
  subtitle: "Pergunte sobre estoque, lista de compras ou gastos do mês",
  emptyTitle: "Comece a conversa",
  emptyDescription:
    "Pergunte, por exemplo: o que está acabando, o que comprar ou quanto gastei este mês.",
  inputLabel: "Mensagem",
  inputPlaceholder: "Ex.: O que preciso comprar agora?",
  send: "Enviar",
  loadError: "Não foi possível carregar a conversa",
  sendError: "Não foi possível enviar a mensagem",
  you: "Você",
  assistant: "Assistente",
  ctaStockOut: "Revisar baixa",
  ctaShoppingList: "Abrir lista",
  ctaFinance: "Ver financeiro",
  ctaDefault: "Abrir",
};

export function chatCtaLabel(payload) {
  const type = payload?.type;
  if (type === "stock_out_draft") return CHAT_PAGE_COPY.ctaStockOut;
  if (type === "shopping_list") return CHAT_PAGE_COPY.ctaShoppingList;
  if (type === "finance_tip") return CHAT_PAGE_COPY.ctaFinance;
  return CHAT_PAGE_COPY.ctaDefault;
}
