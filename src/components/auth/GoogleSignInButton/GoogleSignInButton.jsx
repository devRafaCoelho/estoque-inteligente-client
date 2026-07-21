import { GoogleLogin } from "@react-oauth/google";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
    <Box
      sx={{
        width: "100%",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
        display: "flex",
        justifyContent: "center",
        "& > div": { width: "100% !important" },
        "& iframe": { width: "100% !important" },
      }}
    >
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) {
            onError?.("Google não retornou credencial");
            return;
          }
          try {
            await onSuccess(response.credential);
          } catch (err) {
            onError?.(err?.message || "Falha no login com Google");
          }
        }}
        onError={() => onError?.("Não foi possível conectar ao Google")}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
      />
      {!googleClientId && (
        <Typography variant="caption" color="text.secondary">
          Configure VITE_GOOGLE_CLIENT_ID
        </Typography>
      )}
    </Box>
  );
}
