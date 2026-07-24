import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import FormDialog from "../../common/FormDialog/FormDialog";
import ProductCategorySelectField from "../../form/ProductCategorySelectField";
import StockUnitSelectField from "../../form/StockUnitSelectField";
import { productSchema } from "../../../schemas/products/productSchema";
import { formFieldsStackSx } from "../../../styles/dialogStyles";
import { fullWidthFieldSx } from "../../../styles/formStyles";
import {
  isFilled,
  isNonNegativeNumber,
} from "../../../utils/formValidation";
import {
  PRODUCT_FORM_DIALOG_CONFIG,
  PRODUCT_FORM_DIALOG_COPY,
} from "./productFormDialogConfig";
import { quantityUnitRowSx, unitFieldSx } from "./ProductFormDialog.styled";

/**
 * Dialog de formulário para adicionar/editar item na lista de cadastro manual.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(values: object) => void | Promise<void>} props.onSubmit
 * @param {object} [props.initialValues]
 * @param {boolean} [props.isEditing]
 */
export default function ProductFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false,
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [open, initialValues, reset]);

  const watched = watch();
  const requiredFilled =
    isFilled(watched.name) &&
    isFilled(watched.category) &&
    isFilled(watched.unit) &&
    isNonNegativeNumber(watched.quantity) &&
    isNonNegativeNumber(watched.minQuantity);
  const canSubmit = isEditing ? requiredFilled && isDirty : requiredFilled;

  const handleDiscard = () => {
    reset(initialValues);
  };

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onDiscard={handleDiscard}
      title={
        isEditing
          ? PRODUCT_FORM_DIALOG_COPY.editTitle
          : PRODUCT_FORM_DIALOG_COPY.createTitle
      }
      formId={PRODUCT_FORM_DIALOG_CONFIG.formId}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      cancelButtonLabel={PRODUCT_FORM_DIALOG_COPY.cancel}
      submitLabel={
        isEditing
          ? PRODUCT_FORM_DIALOG_COPY.updateStage
          : PRODUCT_FORM_DIALOG_COPY.addToStage
      }
      submitDisabled={!canSubmit}
      hasUnsavedChanges={isDirty}
      maxWidth={PRODUCT_FORM_DIALOG_CONFIG.maxWidth}
    >
      <Box sx={formFieldsStackSx}>
        <TextField
          label={PRODUCT_FORM_DIALOG_COPY.nameLabel}
          fullWidth
          autoFocus
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register("name")}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <ProductCategorySelectField
              label={PRODUCT_FORM_DIALOG_COPY.categoryLabel}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(errors.category)}
              helperText={errors.category?.message}
              required
            />
          )}
        />
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={quantityUnitRowSx}>
          <TextField
            label={PRODUCT_FORM_DIALOG_COPY.quantityLabel}
            type="number"
            fullWidth
            required
            inputProps={PRODUCT_FORM_DIALOG_CONFIG.quantityInputProps}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message}
            {...register("quantity")}
          />
          <Box sx={unitFieldSx}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <StockUnitSelectField
                  label={PRODUCT_FORM_DIALOG_COPY.unitLabel}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(errors.unit)}
                  helperText={errors.unit?.message}
                  required
                />
              )}
            />
          </Box>
        </Stack>
        <TextField
          label={PRODUCT_FORM_DIALOG_COPY.minQuantityLabel}
          type="number"
          fullWidth
          required
          inputProps={PRODUCT_FORM_DIALOG_CONFIG.minQuantityInputProps}
          error={Boolean(errors.minQuantity)}
          helperText={errors.minQuantity?.message}
          {...register("minQuantity")}
        />
        <TextField
          label={PRODUCT_FORM_DIALOG_COPY.notesLabel}
          multiline
          minRows={2}
          fullWidth
          sx={fullWidthFieldSx}
          {...register("notes")}
        />
      </Box>
    </FormDialog>
  );
}
