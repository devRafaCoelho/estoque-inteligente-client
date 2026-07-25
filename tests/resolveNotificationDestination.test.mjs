import assert from "node:assert/strict";
import {
  NOTIFICATION_ACTIONS,
  NOTIFICATION_DESTINATION,
  buildStockOutDraftText,
  resolveNotificationDestination,
} from "../src/utils/notifications/resolveNotificationDestination.js";

{
  const dest = resolveNotificationDestination({
    type: "low_stock",
    productId: "p1",
    payload: { action: NOTIFICATION_ACTIONS.openProduct, productId: "p1" },
  });
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.product);
  assert.equal(dest.path, "/produtos/p1");
}

{
  const notification = {
    type: "missing_consumption",
    productId: null,
    payload: {
      action: NOTIFICATION_ACTIONS.openQuickConsume,
      productIds: ["a", "b", "c"],
      items: [
        { name: "Sabonete em barra" },
        { name: "Banana prata" },
        { name: "Tomate" },
      ],
    },
  };
  const dest = resolveNotificationDestination(notification);
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.stockOut);
  assert.equal(dest.path, "/baixa");
  assert.equal(
    dest.state.draftText,
    "dê baixa em 1 Sabonete em barra, 1 Banana prata e 1 Tomate",
  );
  assert.equal(
    buildStockOutDraftText(notification),
    "dê baixa em 1 Sabonete em barra, 1 Banana prata e 1 Tomate",
  );
}

{
  const dest = resolveNotificationDestination({
    type: "missing_consumption",
    productId: "p2",
    payload: {
      action: NOTIFICATION_ACTIONS.openQuickConsume,
      productId: "p2",
      productIds: ["p2"],
    },
  });
  assert.equal(dest.kind, NOTIFICATION_DESTINATION.quickConsume);
  assert.equal(dest.path, "/produtos/p2?baixa=1");
}

console.log("resolveNotificationDestination.test.mjs: ok");
