import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LoadingButton from "../LoadingButton/LoadingButton";
import { cancelConfirmDialogActionsSx } from "../../../styles/dialogStyles";

/**
 * Diálogo de confirmação genérico (descarte, exclusão, cancelamento, etc.).
 * Em tablet/mobile os botões ficam em coluna com fullWidth (padrão Neoenergia).
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} props.description
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.confirmLoading]
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {'error'|'primary'} [props.confirmColor]
 * @param {object} [props.sx]
 */
export default function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  onConfirm,
  confirmLoading = false,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor = "error",
  sx,
}) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={confirmLoading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      sx={sx}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{description}</Typography>
      </DialogContent>
      <DialogActions sx={cancelConfirmDialogActionsSx} disableSpacing>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={confirmLoading}
          fullWidth={isCompact}
        >
          {cancelLabel}
        </Button>
        <LoadingButton
          color={confirmColor}
          variant="contained"
          loading={confirmLoading}
          onClick={onConfirm}
          fullWidth={isCompact}
        >
          {confirmLabel}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
