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
import { intakeService } from "../../services/intakeService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

const EXAMPLES = [
  "2kg arroz, 1 leite, 500g feijão",
  "comprei 2 kg de arroz e 1 litro de leite",
  "1 lata de milho, 1 azeite, 3 bananas",
];

export default function IntakePage() {
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
      const data = await intakeService.parseText(values.text.trim());
      navigate(`/entrada/${data.intake.id}/preview`);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Não foi possível interpretar o texto");
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
          <Typography variant="h5">Entrada no estoque</Typography>
          <Typography variant="body2" color="text.secondary">
            Descreva a compra em texto livre
          </Typography>
        </Box>
      </Stack>

      <TextField
        label="O que você comprou?"
        placeholder="Ex.: 2kg arroz, 1 leite, 500g feijão"
        multiline
        minRows={4}
        fullWidth
        error={Boolean(errors.text)}
        helperText={
          errors.text?.message ||
          'Separe os itens por vírgula ou "e". Com AI_API_KEY (Gemini) no servidor, a IA interpreta frases mais soltas.'
        }
        {...register("text")}
      />

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {EXAMPLES.map((example) => (
          <Chip
            key={example}
            label={example}
            variant="outlined"
            onClick={() => setValue("text", example, { shouldValidate: true, shouldDirty: true })}
            sx={{ maxWidth: "100%" }}
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
        Interpretar compra
      </LoadingButton>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Quer dar baixa?{" "}
        <Link component={RouterLink} to="/baixa" fontWeight={700}>
          Baixa por texto
        </Link>
      </Typography>
    </Stack>
  );
}
