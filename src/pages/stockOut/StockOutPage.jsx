import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { intakeParseSchema } from "../../schemas";
import { stockOutService } from "../../services/stockOutService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

const EXAMPLES = [
  "dê baixa em 1 leite, 200g de queijo",
  "usei 1 azeite e 2 ovos",
  "consumi 500g de arroz",
];

export default function StockOutPage() {
  const navigate = useNavigate();
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(intakeParseSchema),
    defaultValues: { text: "" },
    mode: "onTouched",
  });

  const text = watch("text");

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await stockOutService.parseText(values.text.trim());
      navigate(`/baixa/${data.stockOut.id}/preview`);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Não foi possível interpretar a baixa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => navigate("/dashboard")} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">Baixa no estoque</Typography>
          <Typography variant="body2" color="text.secondary">
            Descreva o que foi consumido
          </Typography>
        </Box>
      </Stack>

      <TextField
        label="O que você usou?"
        placeholder='Ex.: dê baixa em 1 leite, 200g de queijo'
        multiline
        minRows={4}
        fullWidth
        error={Boolean(errors.text)}
        helperText={errors.text?.message}
        {...register("text")}
      />

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {EXAMPLES.map((example) => (
          <Chip
            key={example}
            label={example}
            variant="outlined"
            onClick={() => setValue("text", example, { shouldValidate: true, shouldDirty: true })}
          />
        ))}
      </Stack>

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={loading}
        disabled={!String(text || "").trim()}
      >
        Interpretar baixa
      </LoadingButton>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Quer registrar uma compra?{" "}
        <Link component={RouterLink} to="/entrada" fontWeight={700}>
          Entrada por texto
        </Link>
      </Typography>
    </Stack>
  );
}
