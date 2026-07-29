import assert from "node:assert/strict";
import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_DESTINATION,
  buildStockOutDraftText,
  isUsualConsumeNotification,
  resolveNotificationDestination,
  resolveSuggestedQuantity,
} from "../src/utils/notifications/resolveNotificationDestination.js";
import { resolveNotificationCtaLabel } from "../src/components/notifications/NotificationCard/notificationCardConfig.js";
import { NOTIFICATION_CARD_COPY } from "../src/components/notifications/NotificationCard/notificationCardCopy.js";

const ctaLabels = {
  usual: NOTIFICATION_CARD_COPY.registerUsualStockOut,
  stockOut: NOTIFICATION_CARD_COPY.registerStockOut,
  product: NOTIFICATION_CARD_COPY.openProduct,
};

// --- low_stock → produto ---
{
  const notification = {
    type: "low_stock",
    productId: "p1",
    payload: { action: NOTIFICATION_ACTIONS.openProduct, productId: "p1" },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.product);
  assert.equal(dest.path, "/produtos/p1");
  assert.equal(resolveNotificationCtaLabel(notification, ctaLabels), "Ver produto");
}

// --- out_of_stock → produto ---
{
  const notification = {
    type: "out_of_stock",
    productId: "p-out",
    payload: { action: NOTIFICATION_ACTIONS.openProduct, productId: "p-out" },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.product);
  assert.equal(dest.path, "/produtos/p-out");
}

// --- repurchase_reminder → produto ---
{
  const notification = {
    type: "repurchase_reminder",
    productId: "p-rep",
    payload: { action: NOTIFICATION_ACTIONS.openProduct, productId: "p-rep" },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.product);
  assert.equal(dest.path, "/produtos/p-rep");
  assert.equal(resolveNotificationCtaLabel(notification, ctaLabels), "Ver produto");
}

// --- Fase 2 open_quick_consume multi-item → /baixa ---
{
  const notification = {
    type: "missing_consumption",
    productId: null,
    payload: {
      action: NOTIFICATION_ACTIONS.openQuickConsume,
      productIds: ["a", "b", "c"],
      items: [
        { name: "Sabonete em barra", suggestedQuantity: 2 },
        { name: "Banana prata", suggestedQuantity: 1 },
        { name: "Tomate" },
      ],
    },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.stockOut);
  assert.equal(dest.path, "/baixa");
  assert.equal(
    dest.state.draftText,
    "dê baixa em 2 Sabonete em barra, 1 Banana prata e 1 Tomate",
  );
  assert.equal(
    buildStockOutDraftText(notification),
    "dê baixa em 2 Sabonete em barra, 1 Banana prata e 1 Tomate",
  );
  assert.equal(
    resolveNotificationCtaLabel(notification, ctaLabels),
    "Registrar baixa usual",
  );
}

// --- Fase 3 quick_consume_usual → diálogo rápido com qty ---
{
  const notification = {
    type: "missing_consumption",
    productId: "p2",
    payload: {
      action: NOTIFICATION_ACTIONS.quickConsumeUsual,
      productId: "p2",
      productIds: ["p2"],
      suggestedQuantity: 1.5,
      unit: "kg",
      items: [{ name: "Arroz", suggestedQuantity: 1.5, unit: "kg" }],
    },
  };
  assert.equal(resolveSuggestedQuantity(notification), 1.5);
  assert.equal(isUsualConsumeNotification(notification), true);
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.quickConsume);
  assert.equal(dest.path, "/produtos/p2?baixa=1&qty=1.5");
  assert.equal(dest.state.suggestedQuantity, 1.5);
  assert.equal(dest.state.unit, "kg");
  assert.equal(
    resolveNotificationCtaLabel(notification, ctaLabels),
    "Registrar baixa usual",
  );
}

// --- Compat: open_quick_consume legado com qty também abre usual ---
{
  const notification = {
    type: "consumption_nudge",
    productId: "p3",
    payload: {
      action: NOTIFICATION_ACTIONS.openQuickConsume,
      productId: "p3",
      productIds: ["p3"],
      suggestedQuantity: 2,
      unit: "un",
    },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.quickConsume);
  assert.equal(dest.path, "/produtos/p3?baixa=1&qty=2");
  assert.equal(isUsualConsumeNotification(notification), true);
}

// --- Nudge genérico sem produto/qty → /baixa sem draft ---
{
  const notification = {
    type: "consumption_nudge",
    productId: null,
    payload: {
      action: NOTIFICATION_ACTIONS.openQuickConsume,
      nudgeDays: 5,
      productsWithStock: 3,
    },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.stockOut);
  assert.equal(dest.path, "/baixa");
  assert.equal(dest.state, undefined);
  assert.equal(
    resolveNotificationCtaLabel(notification, ctaLabels),
    "Registrar baixa",
  );
}

console.log("resolveNotificationDestination.test.mjs: ok");
