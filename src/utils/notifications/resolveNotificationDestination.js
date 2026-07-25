/** Ações emitidas pelo backend em `notification.payload.action`. */
export const NOTIFICATION_ACTIONS = {
  openProduct: "open_product",
  openQuickConsume: "open_quick_consume",
};

export const NOTIFICATION_DESTINATION = {
  product: "product",
  stockOut: "stock_out",
  quickConsume: "quick_consume",
};

const CONSUMPTION_TYPES = new Set(["consumption_nudge", "missing_consumption"]);

/**
 * Texto inicial para `/baixa` a partir dos itens do nudge.
 * @param {object} notification
 * @returns {string|null}
 */
export function buildStockOutDraftText(notification) {
  const items = notification?.payload?.items;
  if (!Array.isArray(items) || !items.length) return null;

  const parts = items
    .map((item) => String(item?.name || "").trim())
    .filter(Boolean)
    .map((name) => `1 ${name}`);

  if (!parts.length) return null;
  if (parts.length === 1) return `dê baixa em ${parts[0]}`;
  if (parts.length === 2) return `dê baixa em ${parts[0]} e ${parts[1]}`;
  return `dê baixa em ${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

/**
 * Destino de navegação a partir de `payload.action` (com fallbacks).
 *
 * - open_product → detalhe do produto
 * - open_quick_consume com 1 produto → fluxo rápido (baixa no detalhe)
 * - open_quick_consume com vários / sem produto → /baixa (com rascunho de texto quando houver itens)
 *
 * @param {object} notification
 * @returns {{ kind: string, path: string, productId?: string, state?: object } | null}
 */
export function resolveNotificationDestination(notification) {
  if (!notification) return null;

  const payload = notification.payload || {};
  const action = payload.action;
  const productId =
    payload.productId ||
    notification.productId ||
    (Array.isArray(payload.productIds) && payload.productIds.length === 1
      ? payload.productIds[0]
      : null);

  if (action === NOTIFICATION_ACTIONS.openQuickConsume) {
    const ids = Array.isArray(payload.productIds) ? payload.productIds.filter(Boolean) : [];
    if (productId && ids.length <= 1) {
      return {
        kind: NOTIFICATION_DESTINATION.quickConsume,
        path: `/produtos/${productId}?baixa=1`,
        productId,
      };
    }
    const draftText = buildStockOutDraftText(notification);
    return {
      kind: NOTIFICATION_DESTINATION.stockOut,
      path: "/baixa",
      state: draftText ? { draftText } : undefined,
    };
  }

  if (action === NOTIFICATION_ACTIONS.openProduct && productId) {
    return {
      kind: NOTIFICATION_DESTINATION.product,
      path: `/produtos/${productId}`,
      productId,
    };
  }

  if (CONSUMPTION_TYPES.has(notification.type)) {
    if (productId) {
      return {
        kind: NOTIFICATION_DESTINATION.quickConsume,
        path: `/produtos/${productId}?baixa=1`,
        productId,
      };
    }
    const draftText = buildStockOutDraftText(notification);
    return {
      kind: NOTIFICATION_DESTINATION.stockOut,
      path: "/baixa",
      state: draftText ? { draftText } : undefined,
    };
  }

  if (productId) {
    return {
      kind: NOTIFICATION_DESTINATION.product,
      path: `/produtos/${productId}`,
      productId,
    };
  }

  return null;
}

/**
 * @param {object} notification
 */
export function isNotificationNavigable(notification) {
  return Boolean(resolveNotificationDestination(notification));
}
