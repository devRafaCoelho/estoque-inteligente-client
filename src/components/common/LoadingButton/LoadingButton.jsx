import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { LOADING_BUTTON_CONFIG } from "./loadingButtonConfig";

export default function LoadingButton({ loading = false, children, disabled, ...props }) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <CircularProgress size={LOADING_BUTTON_CONFIG.progressSize} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
}
