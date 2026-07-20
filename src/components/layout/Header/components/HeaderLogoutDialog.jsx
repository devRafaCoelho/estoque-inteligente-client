import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "../../../common/LoadingButton";
import { HEADER_COPY } from "../headerCopy";

export default function HeaderLogoutDialog({
  open,
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">{HEADER_COPY.logoutTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          {HEADER_COPY.logoutDescription}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          {HEADER_COPY.logoutCancel}
        </Button>
        <LoadingButton
          onClick={onConfirm}
          variant="contained"
          color="error"
          loading={loading}
        >
          {HEADER_COPY.logoutConfirm}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
