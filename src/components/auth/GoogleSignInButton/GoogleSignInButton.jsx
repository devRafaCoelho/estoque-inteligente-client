import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import {
  clearGoogleCredentialHandler,
  ensureGoogleIdentityInitialized,
  renderGoogleSignInButton,
  setGoogleCredentialHandler,
} from "../../../utils/googleIdentity";
import { GOOGLE_SIGN_IN_BUTTON_CONFIG } from "./googleSignInButtonConfig";
import { GOOGLE_SIGN_IN_BUTTON_COPY } from "./googleSignInButtonCopy";
import {
  googleGlyphSx,
  googleSignInButtonSx,
  googleSignInHiddenHostSx,
  googleSignInWrapperSx,
} from "./GoogleSignInButton.styled";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function isGoogleAuthConfigured() {
  return Boolean(googleClientId);
}

function GoogleGlyph() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={googleGlyphSx}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Box>
  );
}

/**
 * Botão MUI full-width clicável; o widget oficial do Google fica oculto
 * e é acionado programaticamente para emitir o idToken.
 *
 * @param {{ onSuccess: (idToken: string) => void | Promise<void>, onError?: (message: string) => void, disabled?: boolean }} props
 */
export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef(null);
  const handlersRef = useRef({ onSuccess, onError });
  const ownerIdRef = useRef(`google-btn-${Math.random().toString(36).slice(2)}`);
  handlersRef.current = { onSuccess, onError };

  useEffect(() => {
    if (!isGoogleAuthConfigured() || !hostRef.current) return undefined;

    const container = hostRef.current;
    const ownerId = ownerIdRef.current;
    let cancelled = false;

    const handleCredential = async (response) => {
      if (!response?.credential) {
        handlersRef.current.onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.noCredential);
        return;
      }
      setBusy(true);
      try {
        await handlersRef.current.onSuccess(response.credential);
      } catch (err) {
        handlersRef.current.onError?.(
          err?.message || GOOGLE_SIGN_IN_BUTTON_COPY.loginFailed,
        );
      } finally {
        setBusy(false);
      }
    };

    setGoogleCredentialHandler(ownerId, handleCredential);

    const setup = async () => {
      try {
        await ensureGoogleIdentityInitialized(googleClientId);
        if (cancelled || !container.isConnected) return;
        renderGoogleSignInButton(container, {
          type: GOOGLE_SIGN_IN_BUTTON_CONFIG.type,
          theme: GOOGLE_SIGN_IN_BUTTON_CONFIG.theme,
          size: GOOGLE_SIGN_IN_BUTTON_CONFIG.size,
          text: GOOGLE_SIGN_IN_BUTTON_CONFIG.text,
          shape: GOOGLE_SIGN_IN_BUTTON_CONFIG.shape,
          logo_alignment: GOOGLE_SIGN_IN_BUTTON_CONFIG.logoAlignment,
          width: GOOGLE_SIGN_IN_BUTTON_CONFIG.width,
        });
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) {
          handlersRef.current.onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.loginFailed);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      clearGoogleCredentialHandler(ownerId);
      container.innerHTML = "";
      setReady(false);
    };
  }, []);

  const handleClick = () => {
    if (disabled || busy || !ready) return;
    const googleButton = hostRef.current?.querySelector(
      'div[role="button"], div[role="presentation"] div',
    );
    if (!googleButton) {
      onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.loginFailed);
      return;
    }
    googleButton.click();
  };

  if (!isGoogleAuthConfigured()) return null;

  return (
    <Box sx={googleSignInWrapperSx(disabled || busy)}>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        disabled={disabled || busy || !ready}
        onClick={handleClick}
        startIcon={
          busy ? (
            <CircularProgress size={GOOGLE_SIGN_IN_BUTTON_CONFIG.progressSize} color="inherit" />
          ) : (
            <GoogleGlyph />
          )
        }
        sx={googleSignInButtonSx}
      >
        {GOOGLE_SIGN_IN_BUTTON_COPY.buttonLabel}
      </Button>
      <Box
        ref={hostRef}
        sx={googleSignInHiddenHostSx}
        aria-hidden
      />
    </Box>
  );
}
