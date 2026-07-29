import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_CARD_CONFIG,
  NOTIFICATION_TYPES,
} from "../../../utils/notifications/notificationConstants.js";
import { isUsualConsumeNotification } from "../../../utils/notifications/resolveNotificationDestination.js";

export { NOTIFICATION_ACTIONS, NOTIFICATION_CARD_CONFIG, NOTIFICATION_TYPES };

/**
 * @param {string|null|undefined} type
 * @returns {'error'|'warning'|'primary'|'default'}
 */
export function resolveNotificationTone(type) {
  switch (type) {
    case NOTIFICATION_TYPES.outOfStock:
      return "error";
    case NOTIFICATION_TYPES.lowStock:
    case NOTIFICATION_TYPES.repurchase:
      return "warning";
    case NOTIFICATION_TYPES.consumptionNudge:
    case NOTIFICATION_TYPES.missingConsumption:
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
    notification?.type === NOTIFICATION_TYPES.consumptionNudge ||
    notification?.type === NOTIFICATION_TYPES.missingConsumption ||
    notification?.payload?.action === NOTIFICATION_ACTIONS.openQuickConsume ||
    notification?.payload?.action === NOTIFICATION_ACTIONS.quickConsumeUsual
  );
}

/**
 * Label do CTA principal do card (baixa usual vs baixa genérica vs produto).
 * @param {object} notification
 * @param {{ usual: string, stockOut: string, product: string }} labels
 * @returns {string|null}
 */
export function resolveNotificationCtaLabel(notification, labels) {
  if (isUsualConsumeNotification(notification)) return labels.usual;
  if (isConsumptionNudge(notification)) return labels.stockOut;
  if (notification?.productId) return labels.product;
  return null;
}
