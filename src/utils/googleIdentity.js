const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise = null;
let initializedClientId = null;
let credentialHandler = null;
let handlerOwnerId = null;

/**
 * Registra o callback ativo sem reinicializar o GSI.
 * `ownerId` evita que o unmount de uma tela limpe o handler da próxima.
 */
export function setGoogleCredentialHandler(ownerId, handler) {
  handlerOwnerId = ownerId;
  credentialHandler = typeof handler === "function" ? handler : null;
}

export function clearGoogleCredentialHandler(ownerId) {
  if (handlerOwnerId !== ownerId) return;
  handlerOwnerId = null;
  credentialHandler = null;
}

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Identity só funciona no browser"));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Falha ao carregar Google Identity")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar Google Identity"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Garante um único `google.accounts.id.initialize` por clientId.
 */
export async function ensureGoogleIdentityInitialized(clientId) {
  if (!clientId) return;
  await loadGoogleIdentityScript();

  if (initializedClientId === clientId) return;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      credentialHandler?.(response);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  initializedClientId = clientId;
}

export function renderGoogleSignInButton(container, options) {
  if (!container || !window.google?.accounts?.id) return;
  container.innerHTML = "";
  window.google.accounts.id.renderButton(container, options);
}
