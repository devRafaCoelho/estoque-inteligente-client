export const CHAT_PROPOSAL_CARD_COPY = {
  stockOutTitle: "Proposta de baixa",
  intakeTitle: "Proposta de entrada",
  shoppingListTitle: "Proposta de lista",
  financeTitle: "Resumo financeiro",
  defaultTitle: "Proposta",
  stockOutBody: (count) =>
    count === 1
      ? "1 item pronto para revisar no preview."
      : `${count} itens prontos para revisar no preview.`,
  intakeBody: (count) =>
    count === 1
      ? "1 item pronto para revisar — o estoque só muda após confirmar."
      : `${count} itens prontos para revisar — o estoque só muda após confirmar.`,
  intakeBodyLowConfidence: (count, lowCount) => {
    const draft =
      count === 1 ? "1 item no rascunho" : `${count} itens no rascunho`;
    const low =
      lowCount === 1
        ? "1 com baixa confiança"
        : `${lowCount} com baixa confiança`;
    return `${draft} · ${low} — revise antes de confirmar.`;
  },
  shoppingListBodySave: (count) =>
    count === 1
      ? "1 item sugerido. Nada foi gravado ainda."
      : `${count} itens sugeridos. Nada foi gravado ainda.`,
  shoppingListBodyOpen: "Não há itens novos; você pode abrir a lista atual.",
  financeBody: "Consulte o detalhe na tela Financeiro.",
  ctaStockOut: "Revisar baixa",
  ctaIntake: "Revisar entrada",
  ctaSaveList: "Salvar lista",
  ctaOpenList: "Abrir lista",
  ctaFinance: "Ver financeiro",
  ctaDefault: "Abrir",
  itemLine: (item) => {
    const qty = item.quantity != null ? `${item.quantity} ` : "";
    const unit = item.unit ? `${item.unit} ` : "";
    const base = `${qty}${unit}${item.name}`.trim();
    return item.lowConfidence ? `${base} (revisar)` : base;
  },
};

/**
 * Proposta de entrada/compra do chat (F3-2.1 / F3-2.2).
 * Aceita type intake_draft ou tool propose_intake.
 */
export function isIntakeProposalPayload(payload) {
  if (!payload || typeof payload !== "object") return false;
  return (
    payload.type === "intake_draft" ||
    payload.tool === "propose_intake" ||
    payload.cta === "review_intake"
  );
}

export function isProposalPayload(payload) {
  const type = payload?.type;
  return (
    type === "stock_out_draft" ||
    type === "intake_draft" ||
    type === "shopping_list_proposal" ||
    type === "shopping_list" ||
    type === "finance_tip" ||
    isIntakeProposalPayload(payload)
  );
}

export function proposalCardTitle(payload) {
  if (isIntakeProposalPayload(payload)) {
    return CHAT_PROPOSAL_CARD_COPY.intakeTitle;
  }
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
  if (isIntakeProposalPayload(payload)) {
    const count = payload.itemCount ?? payload.items?.length ?? 0;
    if (payload.hasLowConfidenceItems && payload.lowConfidenceCount > 0) {
      return CHAT_PROPOSAL_CARD_COPY.intakeBodyLowConfidence(
        count,
        payload.lowConfidenceCount,
      );
    }
    return CHAT_PROPOSAL_CARD_COPY.intakeBody(count);
  }
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
  if (isIntakeProposalPayload(payload)) {
    return CHAT_PROPOSAL_CARD_COPY.ctaIntake;
  }
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

/**
 * Destino do CTA — entrada sempre vai ao preview (nunca confirma estoque no chat).
 * @param {object} payload
 * @param {{ finance?: string, shoppingList?: string, intake?: string }} [fallbackPaths]
 * @returns {string|null}
 */
export function resolveProposalNavigatePath(payload, fallbackPaths = {}) {
  if (!payload || typeof payload !== "object") return null;

  if (isIntakeProposalPayload(payload)) {
    const intakeId = payload.intakeId;
    if (intakeId) return `/entrada/${intakeId}/preview`;
    if (typeof payload.path === "string" && payload.path.includes("/preview")) {
      return payload.path;
    }
    return fallbackPaths.intake || "/entrada";
  }

  if (typeof payload.path === "string" && payload.path) {
    return payload.path;
  }

  if (payload.type === "finance_tip") {
    return fallbackPaths.finance || "/financeiro";
  }
  if (payload.type === "shopping_list_proposal" || payload.type === "shopping_list") {
    return fallbackPaths.shoppingList || "/lista-compras";
  }
  if (payload.type === "stock_out_draft" && payload.stockOutId) {
    return `/baixa/${payload.stockOutId}/preview`;
  }

  return null;
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
