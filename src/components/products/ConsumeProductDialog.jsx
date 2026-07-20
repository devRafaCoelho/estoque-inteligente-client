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
import { consumeSchema } from "../../schemas";
import LoadingButton from "../common/LoadingButton";
import { formatQuantity } from "../../utils/unitLabels";

export default function ConsumeProductDialog({ open, onClose, product, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(consumeSchema),
    defaultValues: { quantity: 1, note: "" },
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Dar baixa — {product.name}</DialogTitle>
      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Estoque atual: {formatQuantity(product.quantity, product.unit)}
            </Typography>
            <TextField
              label="Quantidade"
              type="number"
              inputProps={{ step: "any", min: 0 }}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              {...register("quantity")}
            />
            <TextField label="Observação (opcional)" {...register("note")} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Confirmar
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
