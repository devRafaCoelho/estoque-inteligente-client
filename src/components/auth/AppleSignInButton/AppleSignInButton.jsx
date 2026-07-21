import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AppleIcon from "@mui/icons-material/Apple";

const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
const appleRedirectUri =
  import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin;

const APPLE_SCRIPT =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

export function isAppleAuthConfigured() {
  return Boolean(appleClientId);
}

function loadAppleScript() {
  if (window.AppleID) return Promise.resolve();
  const existing = document.querySelector(`script[src="${APPLE_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar Apple JS")));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = APPLE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar Apple JS"));
    document.head.appendChild(script);
  });
}

/**
 * @param {{ onSuccess: (payload: { idToken: string, fullName?: string | null }) => void | Promise<void>, onError?: (message: string) => void, disabled?: boolean, label?: string }} props
 */
export default function AppleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  label = "Continuar com Apple",
}) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAppleAuthConfigured()) return undefined;
    let cancelled = false;
    loadAppleScript()
      .then(() => {
        if (cancelled) return;
        window.AppleID.auth.init({
          clientId: appleClientId,
          scope: "name email",
          redirectURI: appleRedirectUri,
          usePopup: true,
        });
        setReady(true);
      })
      .catch((err) => {
        if (!cancelled) onError?.(err.message || "Apple JS indisponível");
      });
    return () => {
      cancelled = true;
    };
  }, [onError]);

  const handleClick = useCallback(async () => {
    if (!ready || loading) return;
    setLoading(true);
    try {
      const response = await window.AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;
      if (!idToken) {
        onError?.("Apple não retornou id_token");
        return;
      }
      const nameParts = response?.user?.name;
      const fullName = nameParts
        ? [nameParts.firstName, nameParts.lastName].filter(Boolean).join(" ").trim() || null
        : null;
      await onSuccess({ idToken, fullName });
    } catch (err) {
      if (err?.error === "popup_closed_by_user") return;
      onError?.(err?.message || "Falha no login com Apple");
    } finally {
      setLoading(false);
    }
  }, [ready, loading, onSuccess, onError]);

  if (!isAppleAuthConfigured()) return null;

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      onClick={handleClick}
      disabled={disabled || !ready || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AppleIcon />}
      sx={{
        color: "#111",
        borderColor: "#111",
        bgcolor: "#fff",
        "&:hover": { borderColor: "#111", bgcolor: "#f5f5f5" },
      }}
    >
      {label}
    </Button>
  );
}
