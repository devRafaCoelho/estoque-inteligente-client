import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../schemas";
import { CATEGORY_LABELS, UNIT_LABELS } from "../../config/constants";
import { productService } from "../../services/productService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      category: "grocery",
      quantity: 0,
      unit: "un",
      minQuantity: 1,
      notes: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await productService.create({
        ...values,
        quantity: Number(values.quantity),
        minQuantity: Number(values.minQuantity),
      });
      success("Produto criado");
      navigate(`/produtos/${data.product.id}`);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => navigate("/produtos")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Novo produto</Typography>
      </Stack>

      <TextField
        label="Nome"
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register("name")}
      />
      <TextField select label="Categoria" defaultValue="grocery" {...register("category")}>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={1.5}>
        <TextField
          label="Quantidade"
          type="number"
          fullWidth
          inputProps={{ step: "any", min: 0 }}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity?.message}
          {...register("quantity")}
        />
        <TextField select label="Unidade" defaultValue="un" sx={{ minWidth: 120 }} {...register("unit")}>
          {Object.entries(UNIT_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TextField
        label="Quantidade mínima"
        type="number"
        inputProps={{ step: "any", min: 0 }}
        error={Boolean(errors.minQuantity)}
        helperText={errors.minQuantity?.message}
        {...register("minQuantity")}
      />
      <TextField label="Observações" multiline minRows={2} {...register("notes")} />
      <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
        Salvar
      </LoadingButton>
    </Stack>
  );
}
