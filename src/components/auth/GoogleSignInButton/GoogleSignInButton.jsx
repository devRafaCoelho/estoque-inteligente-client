import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import {
  clearGoogleCredentialHandler,
  ensureGoogleIdentityInitialized,
  renderGoogleSignInButton,
  setGoogleCredentialHandler,
} from "../../../lib/googleIdentity";
import { GOOGLE_SIGN_IN_BUTTON_CONFIG } from "./googleSignInButtonConfig";
import { GOOGLE_SIGN_IN_BUTTON_COPY } from "./googleSignInButtonCopy";
import {
  googleGlyphSx,
  googleSignInButtonSx,
  googleSignInOverlaySx,
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
 * Botão estilo Toolpad / MUI Sign-in (outlined + ícone),
 * com o widget oficial do Google invisível por cima para emitir o idToken.
 *
 * @param {{ onSuccess: (idToken: string) => void | Promise<void>, onError?: (message: string) => void, disabled?: boolean }} props
 */
export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  const [busy, setBusy] = useState(false);
  const overlayRef = useRef(null);
  const handlersRef = useRef({ onSuccess, onError });
  const lastWidthRef = useRef(0);
  const ownerIdRef = useRef(`google-btn-${Math.random().toString(36).slice(2)}`);
  handlersRef.current = { onSuccess, onError };

  useEffect(() => {
    if (!isGoogleAuthConfigured() || !overlayRef.current) return undefined;

    const container = overlayRef.current;
    const ownerId = ownerIdRef.current;
    let cancelled = false;
    let resizeTimer = null;

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

    const paintButton = () => {
      if (cancelled || !container.isConnected) return;
      const width = Math.max(Math.floor(container.getBoundingClientRect().width), 280);
      if (width === lastWidthRef.current && container.childElementCount > 0) return;
      lastWidthRef.current = width;
      renderGoogleSignInButton(container, {
        type: GOOGLE_SIGN_IN_BUTTON_CONFIG.type,
        theme: GOOGLE_SIGN_IN_BUTTON_CONFIG.theme,
        size: GOOGLE_SIGN_IN_BUTTON_CONFIG.size,
        text: GOOGLE_SIGN_IN_BUTTON_CONFIG.text,
        shape: GOOGLE_SIGN_IN_BUTTON_CONFIG.shape,
        logo_alignment: GOOGLE_SIGN_IN_BUTTON_CONFIG.logoAlignment,
        width,
      });
    };

    const setup = async () => {
      try {
        await ensureGoogleIdentityInitialized(googleClientId);
        if (cancelled) return;
        paintButton();
      } catch {
        if (!cancelled) {
          handlersRef.current.onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.loginFailed);
        }
      }
    };

    setup();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(paintButton, 150);
          })
        : null;
    observer?.observe(container);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      observer?.disconnect();
      clearGoogleCredentialHandler(ownerId);
      lastWidthRef.current = 0;
      container.innerHTML = "";
    };
  }, []);

  if (!isGoogleAuthConfigured()) return null;

  return (
    <Box sx={googleSignInWrapperSx(disabled || busy)}>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        tabIndex={-1}
        aria-hidden
        disabled={disabled || busy}
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
        ref={overlayRef}
        sx={googleSignInOverlaySx}
        aria-label={GOOGLE_SIGN_IN_BUTTON_COPY.buttonLabel}
      />
    </Box>
  );
}
