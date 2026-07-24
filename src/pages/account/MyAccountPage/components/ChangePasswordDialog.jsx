import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormDialog from "../../../../components/common/FormDialog/FormDialog";
import PasswordTextField from "../../../../components/form/PasswordTextField/PasswordTextField";
import { changePasswordSchema } from "../../../../schemas/account/accountSchema";
import { formFieldsStackSx } from "../../../../styles/dialogStyles";
import {
  buildChangePasswordPayload,
  CHANGE_PASSWORD_FORM_DEFAULT_VALUES,
} from "../../../../utils/account/accountForm";
import { isFilled } from "../../../../utils/formValidation";
import { CHANGE_PASSWORD_DIALOG_COPY } from "../myAccountCopy";

const FORM_ID = "change-password-form";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(payload: ReturnType<typeof buildChangePasswordPayload>) => void | Promise<void>} props.onSubmit
 * @param {boolean} [props.submitting]
 */
export default function ChangePasswordDialog({
  open,
  onClose,
  onSubmit,
  submitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: CHANGE_PASSWORD_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(CHANGE_PASSWORD_FORM_DEFAULT_VALUES);
    }
  }, [open, reset]);

  const loading = submitting || isSubmitting;
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const canSubmit =
    isDirty &&
    isFilled(newPassword) &&
    String(newPassword).length >= 8 &&
    isFilled(confirmPassword) &&
    String(newPassword) === String(confirmPassword);

  const handleDiscard = () => {
    reset(CHANGE_PASSWORD_FORM_DEFAULT_VALUES);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(buildChangePasswordPayload(data));
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onDiscard={handleDiscard}
      title={CHANGE_PASSWORD_DIALOG_COPY.title}
      formId={FORM_ID}
      onSubmit={handleFormSubmit}
      isSubmitting={loading}
      cancelButtonLabel={CHANGE_PASSWORD_DIALOG_COPY.cancelar}
      submitLabel={CHANGE_PASSWORD_DIALOG_COPY.salvar}
      submitDisabled={!canSubmit}
      hasUnsavedChanges={isDirty}
      maxWidth="xs"
    >
      <Box sx={formFieldsStackSx}>
        <PasswordTextField
          label={CHANGE_PASSWORD_DIALOG_COPY.currentPassword}
          registerProps={register("currentPassword")}
          error={errors.currentPassword}
          helperText={errors.currentPassword?.message}
          autoComplete="current-password"
        />
        <PasswordTextField
          label={CHANGE_PASSWORD_DIALOG_COPY.newPassword}
          registerProps={register("newPassword")}
          error={errors.newPassword}
          helperText={errors.newPassword?.message}
          autoComplete="new-password"
        />
        <PasswordTextField
          label={CHANGE_PASSWORD_DIALOG_COPY.confirmPassword}
          registerProps={register("confirmPassword")}
          error={errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
        />
      </Box>
    </FormDialog>
  );
}
