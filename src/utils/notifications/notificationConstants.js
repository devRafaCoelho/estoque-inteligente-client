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
  /** Fase 2 — abre baixa rápida / /baixa (sem qty usual obrigatória). */
  openQuickConsume: "open_quick_consume",
  /** Fase 3 — baixa rápida com quantidade usual pré-preenchida. */
  quickConsumeUsual: "quick_consume_usual",
};

export const NOTIFICATION_CARD_CONFIG = {
  types: NOTIFICATION_TYPES,
  actions: NOTIFICATION_ACTIONS,
};
