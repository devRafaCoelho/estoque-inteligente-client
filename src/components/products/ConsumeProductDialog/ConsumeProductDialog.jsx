import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormDialog from "../../common/FormDialog/FormDialog";
import { consumeSchema } from "../../../schemas/products/productSchema";
import { formatQuantity } from "../../../utils/unitLabels";
import { isPositiveNumber } from "../../../utils/formValidation";
import { CONSUME_PRODUCT_DIALOG_COPY } from "./consumeProductDialogCopy";
import { CONSUME_PRODUCT_DIALOG_CONFIG } from "./consumeProductDialogConfig";
import { formStackSpacing } from "./ConsumeProductDialog.styled";

const FORM_ID = "consume-product-form";

export default function ConsumeProductDialog({ open, onClose, product, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(consumeSchema),
    defaultValues: { ...CONSUME_PRODUCT_DIALOG_CONFIG.defaultValues },
  });

  const quantity = watch("quantity");
  const canSubmit = isPositiveNumber(quantity);

  useEffect(() => {
    if (open) {
      reset({ ...CONSUME_PRODUCT_DIALOG_CONFIG.defaultValues });
    }
  }, [open, reset]);

  if (!product) return null;

  const handleDiscard = () => {
    reset({ ...CONSUME_PRODUCT_DIALOG_CONFIG.defaultValues });
  };

  const handleFormSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await onConfirm(values);
      reset({ ...CONSUME_PRODUCT_DIALOG_CONFIG.defaultValues });
      onClose();
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onDiscard={handleDiscard}
      title={`${CONSUME_PRODUCT_DIALOG_COPY.titlePrefix} ${product.name}`}
      formId={FORM_ID}
      onSubmit={handleFormSubmit}
      isSubmitting={loading}
      cancelButtonLabel={CONSUME_PRODUCT_DIALOG_COPY.cancel}
      submitLabel={CONSUME_PRODUCT_DIALOG_COPY.confirm}
      submitDisabled={!canSubmit}
      hasUnsavedChanges={isDirty}
      maxWidth={CONSUME_PRODUCT_DIALOG_CONFIG.maxWidth}
      submitStartIcon={null}
    >
      <Stack spacing={formStackSpacing}>
        <Typography variant="body2" color="text.secondary">
          {CONSUME_PRODUCT_DIALOG_COPY.currentStockPrefix}{" "}
          {formatQuantity(product.quantity, product.unit)}
        </Typography>
        <TextField
          label={CONSUME_PRODUCT_DIALOG_COPY.quantityLabel}
          type="number"
          fullWidth
          inputProps={CONSUME_PRODUCT_DIALOG_CONFIG.quantityInputProps}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity?.message}
          {...register("quantity", {
            setValueAs: (value) =>
              value === "" || value == null ? undefined : Number(value),
          })}
        />
        <TextField
          label={CONSUME_PRODUCT_DIALOG_COPY.noteLabel}
          fullWidth
          {...register("note")}
        />
      </Stack>
    </FormDialog>
  );
}
