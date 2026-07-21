import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import GoogleSignInButton, {
  isGoogleAuthConfigured,
} from "./GoogleSignInButton/GoogleSignInButton";
import AppleSignInButton, {
  isAppleAuthConfigured,
} from "./AppleSignInButton/AppleSignInButton";

export function hasSocialAuthConfigured() {
  return isGoogleAuthConfigured() || isAppleAuthConfigured();
}

/**
 * Bloco social para Login/Cadastro.
 * @param {{ onGoogle: (idToken: string) => Promise<void>, onApple: (payload: { idToken: string, fullName?: string | null }) => Promise<void>, onError: (message: string) => void, disabled?: boolean }} props
 */
export default function SocialAuthButtons({ onGoogle, onApple, onError, disabled = false }) {
  if (!hasSocialAuthConfigured()) return null;

  return (
    <Stack spacing={1.5}>
      <GoogleSignInButton onSuccess={onGoogle} onError={onError} disabled={disabled} />
      <AppleSignInButton onSuccess={onApple} onError={onError} disabled={disabled} />
      <Divider>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          ou continue com e-mail
        </Typography>
      </Divider>
    </Stack>
  );
}
