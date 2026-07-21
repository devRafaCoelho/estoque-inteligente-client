import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { consumeSchema } from "../../../schemas";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import { formatQuantity } from "../../../utils/unitLabels";
import { CONSUME_PRODUCT_DIALOG_COPY } from "./consumeProductDialogCopy";
import { CONSUME_PRODUCT_DIALOG_CONFIG } from "./consumeProductDialogConfig";
import { dialogActionsSx, formStackSpacing } from "./ConsumeProductDialog.styled";

export default function ConsumeProductDialog({ open, onClose, product, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(consumeSchema),
    defaultValues: { ...CONSUME_PRODUCT_DIALOG_CONFIG.defaultValues },
  });

  const submit = async (values) => {
    setLoading(true);
    try {
      await onConfirm(values);
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={CONSUME_PRODUCT_DIALOG_CONFIG.maxWidth}>
      <DialogTitle>
        {CONSUME_PRODUCT_DIALOG_COPY.titlePrefix} {product.name}
      </DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={formStackSpacing}>
            <Typography variant="body2" color="text.secondary">
              {CONSUME_PRODUCT_DIALOG_COPY.currentStockPrefix}{" "}
              {formatQuantity(product.quantity, product.unit)}
            </Typography>
            <TextField
              label={CONSUME_PRODUCT_DIALOG_COPY.quantityLabel}
              type="number"
              inputProps={CONSUME_PRODUCT_DIALOG_CONFIG.quantityInputProps}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              {...register("quantity")}
            />
            <TextField
              label={CONSUME_PRODUCT_DIALOG_COPY.noteLabel}
              {...register("note")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={onClose}>{CONSUME_PRODUCT_DIALOG_COPY.cancel}</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {CONSUME_PRODUCT_DIALOG_COPY.confirm}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
