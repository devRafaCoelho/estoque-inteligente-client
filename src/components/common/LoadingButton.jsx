import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

export default function LoadingButton({ loading = false, children, disabled, ...props }) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <CircularProgress size={22} color="inherit" /> : children}
    </Button>
  );
}
