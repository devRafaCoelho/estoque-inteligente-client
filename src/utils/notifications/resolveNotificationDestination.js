import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_CARD_CONFIG,
} from "./notificationConstants.js";

export { NOTIFICATION_ACTIONS };

export const NOTIFICATION_DESTINATION = {
  product: "product",
  stockOut: "stock_out",
  quickConsume: "quick_consume",
};

const { types, actions } = NOTIFICATION_CARD_CONFIG;
const CONSUMPTION_TYPES = new Set([types.consumptionNudge, types.missingConsumption]);

/**
 * Quantidade sugerida no payload (top-level ou primeiro item).
 * @param {object} notification
 * @returns {number|null}
 */
export function resolveSuggestedQuantity(notification) {
  const payload = notification?.payload || {};
  const top = Number(payload.suggestedQuantity);
  if (Number.isFinite(top) && top > 0) return top;

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 1) {
    const itemQty = Number(items[0]?.suggestedQuantity);
    if (Number.isFinite(itemQty) && itemQty > 0) return itemQty;
  }
  return null;
}

function formatSuggestedQty(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "1";
  return Number.isInteger(n) ? String(n) : String(n);
}

/**
 * Texto inicial para `/baixa` a partir dos itens do nudge.
 * @param {object} notification
 * @returns {string|null}
 */
export function buildStockOutDraftText(notification) {
  const items = notification?.payload?.items;
  if (!Array.isArray(items) || !items.length) return null;

  const parts = items
    .map((item) => {
      const name = String(item?.name || "").trim();
      if (!name) return null;
      const qty = formatSuggestedQty(item?.suggestedQuantity ?? 1);
      return `${qty} ${name}`;
    })
    .filter(Boolean);

  if (!parts.length) return null;
  if (parts.length === 1) return `dê baixa em ${parts[0]}`;
  if (parts.length === 2) return `dê baixa em ${parts[0]} e ${parts[1]}`;
  return `dê baixa em ${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

function buildQuickConsumePath(productId, suggestedQuantity) {
  const params = new URLSearchParams({ baixa: "1" });
  if (suggestedQuantity != null) {
    params.set("qty", String(suggestedQuantity));
  }
  return `/produtos/${productId}?${params.toString()}`;
}

/**
 * Destino de navegação a partir de `payload.action` (com fallbacks).
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
  const suggestedQuantity = resolveSuggestedQuantity(notification);

  if (action === actions.openQuickConsume) {
    const ids = Array.isArray(payload.productIds) ? payload.productIds.filter(Boolean) : [];
    if (productId && ids.length <= 1) {
      return {
        kind: NOTIFICATION_DESTINATION.quickConsume,
        path: buildQuickConsumePath(productId, suggestedQuantity),
        productId,
        state:
          suggestedQuantity != null
            ? {
                suggestedQuantity,
                unit: payload.unit || payload.items?.[0]?.unit || null,
              }
            : undefined,
      };
    }
    const draftText = buildStockOutDraftText(notification);
    return {
      kind: NOTIFICATION_DESTINATION.stockOut,
      path: "/baixa",
      state: draftText ? { draftText } : undefined,
    };
  }

  if (action === actions.openProduct && productId) {
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
        path: buildQuickConsumePath(productId, suggestedQuantity),
        productId,
        state:
          suggestedQuantity != null
            ? {
                suggestedQuantity,
                unit: payload.unit || payload.items?.[0]?.unit || null,
              }
            : undefined,
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
