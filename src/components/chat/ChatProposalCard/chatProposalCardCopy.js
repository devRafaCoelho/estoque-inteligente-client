export const CHAT_PROPOSAL_CARD_COPY = {
  stockOutTitle: "Proposta de baixa",
  shoppingListTitle: "Proposta de lista",
  financeTitle: "Resumo financeiro",
  defaultTitle: "Proposta",
  stockOutBody: (count) =>
    count === 1
      ? "1 item pronto para revisar no preview."
      : `${count} itens prontos para revisar no preview.`,
  shoppingListBodySave: (count) =>
    count === 1
      ? "1 item sugerido. Nada foi gravado ainda."
      : `${count} itens sugeridos. Nada foi gravado ainda.`,
  shoppingListBodyOpen: "Não há itens novos; você pode abrir a lista atual.",
  financeBody: "Consulte o detalhe na tela Financeiro.",
  ctaStockOut: "Revisar baixa",
  ctaSaveList: "Salvar lista",
  ctaOpenList: "Abrir lista",
  ctaFinance: "Ver financeiro",
  ctaDefault: "Abrir",
  itemLine: (item) => {
    const qty = item.quantity != null ? `${item.quantity} ` : "";
    const unit = item.unit ? `${item.unit} ` : "";
    return `${qty}${unit}${item.name}`.trim();
  },
};

export function isProposalPayload(payload) {
  const type = payload?.type;
  return (
    type === "stock_out_draft" ||
    type === "shopping_list_proposal" ||
    type === "shopping_list" ||
    type === "finance_tip"
  );
}

export function proposalCardTitle(payload) {
  switch (payload?.type) {
    case "stock_out_draft":
      return CHAT_PROPOSAL_CARD_COPY.stockOutTitle;
    case "shopping_list_proposal":
    case "shopping_list":
      return CHAT_PROPOSAL_CARD_COPY.shoppingListTitle;
    case "finance_tip":
      return CHAT_PROPOSAL_CARD_COPY.financeTitle;
    default:
      return CHAT_PROPOSAL_CARD_COPY.defaultTitle;
  }
}

export function proposalCardBody(payload) {
  switch (payload?.type) {
    case "stock_out_draft":
      return CHAT_PROPOSAL_CARD_COPY.stockOutBody(payload.itemCount ?? payload.items?.length ?? 0);
    case "shopping_list_proposal":
      if (payload.requiresSave && (payload.itemCount ?? payload.items?.length)) {
        return CHAT_PROPOSAL_CARD_COPY.shoppingListBodySave(
          payload.itemCount ?? payload.items.length,
        );
      }
      return CHAT_PROPOSAL_CARD_COPY.shoppingListBodyOpen;
    case "shopping_list":
      return CHAT_PROPOSAL_CARD_COPY.shoppingListBodyOpen;
    case "finance_tip":
      return CHAT_PROPOSAL_CARD_COPY.financeBody;
    default:
      return "";
  }
}

export function proposalCtaLabel(payload) {
  switch (payload?.type) {
    case "stock_out_draft":
      return CHAT_PROPOSAL_CARD_COPY.ctaStockOut;
    case "shopping_list_proposal":
      return payload.requiresSave
        ? CHAT_PROPOSAL_CARD_COPY.ctaSaveList
        : CHAT_PROPOSAL_CARD_COPY.ctaOpenList;
    case "shopping_list":
      return CHAT_PROPOSAL_CARD_COPY.ctaOpenList;
    case "finance_tip":
      return CHAT_PROPOSAL_CARD_COPY.ctaFinance;
    default:
      return CHAT_PROPOSAL_CARD_COPY.ctaDefault;
  }
}

export function proposalItems(payload) {
  if (Array.isArray(payload?.items) && payload.items.length) {
    return payload.items.slice(0, 6);
  }
  if (Array.isArray(payload?.itemNames) && payload.itemNames.length) {
    return payload.itemNames.slice(0, 6).map((name) => ({ name }));
  }
  if (payload?.type === "finance_tip" && payload.tips?.[0]?.message) {
    return [{ name: payload.tips[0].message }];
  }
  return [];
}
