import { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AppleIcon from "@mui/icons-material/Apple";
import { APPLE_SIGN_IN_BUTTON_CONFIG } from "./appleSignInButtonConfig";
import { APPLE_SIGN_IN_BUTTON_COPY } from "./appleSignInButtonCopy";
import { appleSignInButtonSx } from "./AppleSignInButton.styled";

const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
const appleRedirectUri =
  import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin;

export function isAppleAuthConfigured() {
  return Boolean(appleClientId);
}

function loadAppleScript() {
  if (window.AppleID) return Promise.resolve();
  const existing = document.querySelector(
    `script[src="${APPLE_SIGN_IN_BUTTON_CONFIG.scriptUrl}"]`
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(APPLE_SIGN_IN_BUTTON_COPY.scriptLoadFailed))
      );
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = APPLE_SIGN_IN_BUTTON_CONFIG.scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(APPLE_SIGN_IN_BUTTON_COPY.scriptLoadFailed));
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
  label = APPLE_SIGN_IN_BUTTON_COPY.defaultLabel,
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
          scope: APPLE_SIGN_IN_BUTTON_CONFIG.scope,
          redirectURI: appleRedirectUri,
          usePopup: APPLE_SIGN_IN_BUTTON_CONFIG.usePopup,
        });
        setReady(true);
      })
      .catch((err) => {
        if (!cancelled) onError?.(err.message || APPLE_SIGN_IN_BUTTON_COPY.unavailable);
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
        onError?.(APPLE_SIGN_IN_BUTTON_COPY.noIdToken);
        return;
      }
      const nameParts = response?.user?.name;
      const fullName = nameParts
        ? [nameParts.firstName, nameParts.lastName].filter(Boolean).join(" ").trim() || null
        : null;
      await onSuccess({ idToken, fullName });
    } catch (err) {
      if (err?.error === APPLE_SIGN_IN_BUTTON_CONFIG.popupClosedError) return;
      onError?.(err?.message || APPLE_SIGN_IN_BUTTON_COPY.loginFailed);
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
      startIcon={
        loading ? (
          <CircularProgress size={APPLE_SIGN_IN_BUTTON_CONFIG.progressSize} color="inherit" />
        ) : (
          <AppleIcon />
        )
      }
      sx={appleSignInButtonSx}
    >
      {label}
    </Button>
  );
}
