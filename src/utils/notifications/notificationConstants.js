/** Tipos e actions de notificação — fonte única (UI + navegação). */
export const NOTIFICATION_TYPES = {
  lowStock: "low_stock",
  outOfStock: "out_of_stock",
  repurchase: "repurchase_reminder",
  consumptionNudge: "consumption_nudge",
  missingConsumption: "missing_consumption",
};

export const NOTIFICATION_ACTIONS = {
  openProduct: "open_product",
  openQuickConsume: "open_quick_consume",
};

export const NOTIFICATION_CARD_CONFIG = {
  types: NOTIFICATION_TYPES,
  actions: NOTIFICATION_ACTIONS,
};
