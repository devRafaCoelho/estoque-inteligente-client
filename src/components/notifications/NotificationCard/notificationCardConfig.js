import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_CARD_CONFIG,
  NOTIFICATION_TYPES,
} from "../../../utils/notifications/notificationConstants.js";

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
    notification?.payload?.action === NOTIFICATION_ACTIONS.openQuickConsume
  );
}
