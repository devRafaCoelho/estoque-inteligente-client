import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";
import {
  cancelConfirmDialogSx,
  dialogActionsSx,
  dialogContentSx,
  dialogTitleSx,
  responsiveDialogSx,
} from "../../../styles/dialogStyles";
import { refreshMuiInputNotches } from "../../../utils/refreshMuiInputNotches";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import LoadingButton from "../LoadingButton/LoadingButton";
import { FORM_DIALOG_COPY } from "./formDialogCopy";

/**
 * Shell de dialog para formulários (header e footer fixos; conteúdo com scroll).
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void} [props.onDiscard]
 * @param {string} props.title
 * @param {string} [props.closeAriaLabel]
 * @param {string} props.formId
 * @param {React.FormEventHandler<HTMLFormElement>} props.onSubmit
 * @param {boolean} props.isSubmitting
 * @param {string} props.cancelButtonLabel
 * @param {string} props.submitLabel
 * @param {string} [props.cancelConfirmTitle]
 * @param {string} [props.cancelConfirmMessage]
 * @param {string} [props.cancelConfirmContinueLabel]
 * @param {string} [props.cancelConfirmButtonLabel]
 * @param {boolean} [props.submitDisabled]
 * @param {boolean} [props.hasUnsavedChanges=true]
 * @param {React.ReactNode} [props.submitStartIcon]
 * @param {import('@mui/material').DialogProps['maxWidth']} [props.maxWidth]
 * @param {React.ReactNode} props.children
 */
export default function FormDialog({
  open,
  onClose,
  onDiscard,
  title,
  closeAriaLabel = FORM_DIALOG_COPY.closeAriaLabel,
  formId,
  onSubmit,
  isSubmitting,
  cancelButtonLabel,
  submitLabel,
  cancelConfirmTitle = FORM_DIALOG_COPY.cancelConfirmTitle,
  cancelConfirmMessage = FORM_DIALOG_COPY.cancelConfirmMessage,
  cancelConfirmContinueLabel = FORM_DIALOG_COPY.cancelConfirmContinueLabel,
  cancelConfirmButtonLabel = FORM_DIALOG_COPY.cancelConfirmButtonLabel,
  submitDisabled = false,
  hasUnsavedChanges = true,
  submitStartIcon,
  maxWidth = "sm",
  children,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

  const confirmarFechamento = useCallback(() => {
    setConfirmarCancelamento(false);
    onDiscard?.();
    onClose();
  }, [onClose, onDiscard]);

  const solicitarCancelamento = useCallback(() => {
    if (hasUnsavedChanges) {
      setConfirmarCancelamento(true);
      return;
    }
    confirmarFechamento();
  }, [hasUnsavedChanges, confirmarFechamento]);

  const handleDialogClose = useCallback(
    (_event, reason) => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") {
        solicitarCancelamento();
      }
    },
    [solicitarCancelamento],
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        scroll="paper"
        fullScreen={isMobile}
        maxWidth={maxWidth}
        fullWidth
        sx={responsiveDialogSx(isMobile)}
        slotProps={{
          transition: { onEntered: refreshMuiInputNotches },
        }}
      >
        <DialogTitle sx={dialogTitleSx(isMobile)}>
          {title}
          <IconButton
            type="button"
            size="small"
            onClick={solicitarCancelamento}
            aria-label={closeAriaLabel}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={dialogContentSx}>
          <Box component="form" onSubmit={onSubmit} noValidate id={formId}>
            {children}
          </Box>
        </DialogContent>

        <DialogActions sx={dialogActionsSx}>
          <Button
            type="button"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={solicitarCancelamento}
          >
            {cancelButtonLabel}
          </Button>
          <LoadingButton
            type="submit"
            form={formId}
            variant="contained"
            startIcon={submitStartIcon === undefined ? <SaveIcon /> : submitStartIcon}
            loading={isSubmitting}
            disabled={submitDisabled}
          >
            {submitLabel}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={open && confirmarCancelamento}
        onClose={() => setConfirmarCancelamento(false)}
        title={cancelConfirmTitle}
        description={cancelConfirmMessage}
        onConfirm={confirmarFechamento}
        cancelLabel={cancelConfirmContinueLabel}
        confirmLabel={cancelConfirmButtonLabel}
        sx={cancelConfirmDialogSx}
      />
    </>
  );
}
