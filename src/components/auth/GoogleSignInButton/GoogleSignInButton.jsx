import { GoogleLogin } from "@react-oauth/google";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GOOGLE_SIGN_IN_BUTTON_CONFIG } from "./googleSignInButtonConfig";
import { GOOGLE_SIGN_IN_BUTTON_COPY } from "./googleSignInButtonCopy";
import { googleSignInContainerSx } from "./GoogleSignInButton.styled";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function isGoogleAuthConfigured() {
  return Boolean(googleClientId);
}

/**
 * @param {{ onSuccess: (idToken: string) => void | Promise<void>, onError?: (message: string) => void, disabled?: boolean }} props
 */
export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  if (!isGoogleAuthConfigured()) return null;

  return (
    <Box sx={googleSignInContainerSx(disabled)}>
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) {
            onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.noCredential);
            return;
          }
          try {
            await onSuccess(response.credential);
          } catch (err) {
            onError?.(err?.message || GOOGLE_SIGN_IN_BUTTON_COPY.loginFailed);
          }
        }}
        onError={() => onError?.(GOOGLE_SIGN_IN_BUTTON_COPY.connectFailed)}
        useOneTap={GOOGLE_SIGN_IN_BUTTON_CONFIG.useOneTap}
        theme={GOOGLE_SIGN_IN_BUTTON_CONFIG.theme}
        size={GOOGLE_SIGN_IN_BUTTON_CONFIG.size}
        width={GOOGLE_SIGN_IN_BUTTON_CONFIG.width}
        text={GOOGLE_SIGN_IN_BUTTON_CONFIG.text}
        shape={GOOGLE_SIGN_IN_BUTTON_CONFIG.shape}
        logo_alignment={GOOGLE_SIGN_IN_BUTTON_CONFIG.logoAlignment}
      />
      {!googleClientId && (
        <Typography variant="caption" color="text.secondary">
          {GOOGLE_SIGN_IN_BUTTON_COPY.configureClientId}
        </Typography>
      )}
    </Box>
  );
}
