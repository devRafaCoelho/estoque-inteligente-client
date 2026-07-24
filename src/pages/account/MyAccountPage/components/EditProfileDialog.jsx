import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormDialog from "../../../../components/common/FormDialog/FormDialog";
import BrazilianStateSelectField from "../../../../components/form/BrazilianStateSelectField";
import { accountSchema } from "../../../../schemas/account/accountSchema";
import { formGridSx, fullWidthFieldSx } from "../../../../styles/formStyles";
import {
  digitsOnly,
  formatCpf,
  formatPhone,
  formatZipCode,
  lookupAddressByZipCode,
} from "../../../../utils/address";
import {
  ACCOUNT_FORM_DEFAULT_VALUES,
  buildUpdateMePayload,
  mapUserToAccountFormValues,
} from "../../../../utils/account/accountForm";
import { isFilled } from "../../../../utils/formValidation";
import { EDIT_PROFILE_DIALOG_COPY } from "../myAccountCopy";

const FORM_ID = "edit-profile-form";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(payload: ReturnType<typeof buildUpdateMePayload>) => void | Promise<void>} props.onSubmit
 * @param {boolean} [props.submitting]
 * @param {object} [props.user]
 * @param {(message: string) => void} [props.onLookupError]
 */
export default function EditProfileDialog({
  open,
  onClose,
  onSubmit,
  submitting = false,
  user,
  onLookupError,
}) {
  const [lookingUpCep, setLookingUpCep] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues: ACCOUNT_FORM_DEFAULT_VALUES,
  });

  const zipCodeValue = watch("zipCode");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const loading = submitting || isSubmitting;
  const canSubmit = isFilled(firstName) && isFilled(lastName) && isDirty;

  useEffect(() => {
    if (open) {
      reset(mapUserToAccountFormValues(user));
    }
  }, [open, user, reset]);

  useEffect(() => {
    const cep = digitsOnly(zipCodeValue);
    if (!open || cep.length !== 8) return undefined;

    let ativo = true;
    const timer = window.setTimeout(async () => {
      setLookingUpCep(true);
      try {
        const address = await lookupAddressByZipCode(cep);
        if (!ativo) return;
        if (!address) {
          onLookupError?.(EDIT_PROFILE_DIALOG_COPY.zipCodeLookupError);
          return;
        }
        setValue("street", address.street, { shouldDirty: true });
        setValue("complement", address.complement, { shouldDirty: true });
        setValue("neighborhood", address.neighborhood, { shouldDirty: true });
        setValue("city", address.city, { shouldDirty: true });
        if (address.defaultState) {
          setValue("defaultState", address.defaultState, { shouldDirty: true });
        }
      } catch {
        if (ativo) onLookupError?.(EDIT_PROFILE_DIALOG_COPY.zipCodeLookupError);
      } finally {
        if (ativo) setLookingUpCep(false);
      }
    }, 400);

    return () => {
      ativo = false;
      window.clearTimeout(timer);
    };
  }, [zipCodeValue, open, setValue, onLookupError]);

  const handleDiscard = () => {
    reset(mapUserToAccountFormValues(user));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(buildUpdateMePayload(data));
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onDiscard={handleDiscard}
      title={EDIT_PROFILE_DIALOG_COPY.title}
      formId={FORM_ID}
      onSubmit={handleFormSubmit}
      isSubmitting={loading}
      cancelButtonLabel={EDIT_PROFILE_DIALOG_COPY.cancelar}
      submitLabel={EDIT_PROFILE_DIALOG_COPY.salvar}
      submitDisabled={!canSubmit}
      hasUnsavedChanges={isDirty}
      maxWidth="sm"
    >
      <Box sx={formGridSx}>
        <TextField
          label={EDIT_PROFILE_DIALOG_COPY.firstNameLabel}
          fullWidth
          error={Boolean(errors.firstName)}
          helperText={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField
          label={EDIT_PROFILE_DIALOG_COPY.lastNameLabel}
          fullWidth
          error={Boolean(errors.lastName)}
          helperText={errors.lastName?.message}
          {...register("lastName")}
        />
        <TextField
          label={EDIT_PROFILE_DIALOG_COPY.emailLabel}
          fullWidth
          value={user?.email ?? ""}
          disabled
          helperText={EDIT_PROFILE_DIALOG_COPY.emailHelper}
          sx={fullWidthFieldSx}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.phoneLabel}
              fullWidth
              value={formatPhone(field.value)}
              onChange={(e) => field.onChange(digitsOnly(e.target.value).slice(0, 11))}
              onBlur={field.onBlur}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              inputProps={{ inputMode: "tel" }}
            />
          )}
        />
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.cpfLabel}
              fullWidth
              value={formatCpf(field.value)}
              onChange={(e) => field.onChange(digitsOnly(e.target.value).slice(0, 11))}
              onBlur={field.onBlur}
              error={Boolean(errors.cpf)}
              helperText={errors.cpf?.message}
              inputProps={{ inputMode: "numeric" }}
            />
          )}
        />
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.zipCodeLabel}
              fullWidth
              value={formatZipCode(field.value)}
              onChange={(e) => field.onChange(digitsOnly(e.target.value).slice(0, 8))}
              onBlur={field.onBlur}
              error={Boolean(errors.zipCode)}
              helperText={
                errors.zipCode?.message || EDIT_PROFILE_DIALOG_COPY.zipCodeHelper
              }
              inputProps={{ inputMode: "numeric" }}
              InputProps={{
                endAdornment: lookingUpCep ? (
                  <InputAdornment position="end">
                    <CircularProgress size={18} />
                  </InputAdornment>
                ) : null,
              }}
              sx={fullWidthFieldSx}
            />
          )}
        />
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.streetLabel}
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={Boolean(errors.street)}
              helperText={errors.street?.message}
              InputLabelProps={{ shrink: Boolean(field.value) || undefined }}
              sx={fullWidthFieldSx}
            />
          )}
        />
        <TextField
          label={EDIT_PROFILE_DIALOG_COPY.streetNumberLabel}
          fullWidth
          error={Boolean(errors.streetNumber)}
          helperText={errors.streetNumber?.message}
          {...register("streetNumber")}
        />
        <Controller
          name="complement"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.complementLabel}
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={Boolean(errors.complement)}
              helperText={errors.complement?.message}
              InputLabelProps={{ shrink: Boolean(field.value) || undefined }}
            />
          )}
        />
        <Controller
          name="neighborhood"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.neighborhoodLabel}
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={Boolean(errors.neighborhood)}
              helperText={errors.neighborhood?.message}
              InputLabelProps={{ shrink: Boolean(field.value) || undefined }}
              sx={fullWidthFieldSx}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              label={EDIT_PROFILE_DIALOG_COPY.cityLabel}
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              error={Boolean(errors.city)}
              helperText={errors.city?.message}
              InputLabelProps={{ shrink: Boolean(field.value) || undefined }}
            />
          )}
        />
        <Controller
          name="defaultState"
          control={control}
          render={({ field }) => (
            <BrazilianStateSelectField
              label={EDIT_PROFILE_DIALOG_COPY.estadoLabel}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors.defaultState)}
              helperText={errors.defaultState?.message}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}
