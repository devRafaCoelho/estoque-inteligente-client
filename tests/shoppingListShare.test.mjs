import assert from "node:assert/strict";
import {
  SHARED_LIST_PATH_PREFIX,
  buildSharedListUrl,
  buildWhatsAppShareText,
  buildWhatsAppShareUrl,
} from "../src/utils/shopping/shoppingListShare.js";

{
  const url = buildSharedListUrl("abc123token", "https://app.exemplo.com");
  assert.equal(url, "https://app.exemplo.com/lista-compartilhada/abc123token");
  assert.ok(url.startsWith("https://app.exemplo.com" + SHARED_LIST_PATH_PREFIX));
}

{
  // origin com barra final é normalizado
  const url = buildSharedListUrl("tok", "https://app.exemplo.com/");
  assert.equal(url, "https://app.exemplo.com/lista-compartilhada/tok");
}

{
  // token com caracteres especiais é encoded
  const url = buildSharedListUrl("a/b+c", "https://app.exemplo.com");
  assert.equal(
    url,
    "https://app.exemplo.com/lista-compartilhada/a%2Fb%2Bc",
  );
}

{
  const shareUrl = "https://app.exemplo.com/lista-compartilhada/tok123";
  const text = buildWhatsAppShareText(shareUrl);
  assert.match(text, /lista de compras/i);
  assert.ok(text.includes(shareUrl));
  assert.equal(text, `Olá! Segue minha lista de compras:\n${shareUrl}`);
}

{
  const shareUrl = "https://app.exemplo.com/lista-compartilhada/tok123";
  const wa = buildWhatsAppShareUrl(shareUrl);
  assert.ok(wa.startsWith("https://wa.me/?text="));
  const encoded = decodeURIComponent(wa.replace("https://wa.me/?text=", ""));
  assert.equal(encoded, buildWhatsAppShareText(shareUrl));
  assert.ok(encoded.includes(shareUrl));
}

console.log("shoppingListShare.test.mjs: ok");
