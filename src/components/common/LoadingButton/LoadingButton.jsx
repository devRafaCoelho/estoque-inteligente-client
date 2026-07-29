import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { LOADING_BUTTON_CONFIG } from "./loadingButtonConfig";

export default function LoadingButton({
  loading = false,
  children,
  disabled,
  startIcon,
  sx,
  ...props
}) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      {...props}
      sx={[
        { display: "inline-flex", alignItems: "center" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {loading ? (
        <CircularProgress size={LOADING_BUTTON_CONFIG.progressSize} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
}
