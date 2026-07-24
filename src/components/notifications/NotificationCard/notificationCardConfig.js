export const NOTIFICATION_CARD_CONFIG = {
  types: {
    lowStock: "low_stock",
    outOfStock: "out_of_stock",
    repurchase: "repurchase",
    consumptionNudge: "consumption_nudge",
    missingConsumption: "missing_consumption",
  },
  actions: {
    openQuickConsume: "open_quick_consume",
  },
};

/**
 * @param {string|null|undefined} type
 * @returns {'error'|'warning'|'primary'|'default'}
 */
export function resolveNotificationTone(type) {
  switch (type) {
    case NOTIFICATION_CARD_CONFIG.types.outOfStock:
      return "error";
    case NOTIFICATION_CARD_CONFIG.types.lowStock:
    case NOTIFICATION_CARD_CONFIG.types.repurchase:
      return "warning";
    case NOTIFICATION_CARD_CONFIG.types.consumptionNudge:
    case NOTIFICATION_CARD_CONFIG.types.missingConsumption:
      return "primary";
    default:
      return "default";
  }
}

/**
 * @param {object} notification
 * @returns {boolean}
 */
export function isConsumptionNudge(notification) {
  return (
    notification?.type === NOTIFICATION_CARD_CONFIG.types.consumptionNudge ||
    notification?.payload?.action === NOTIFICATION_CARD_CONFIG.actions.openQuickConsume
  );
}
