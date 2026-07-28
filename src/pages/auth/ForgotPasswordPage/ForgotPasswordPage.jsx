import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout/AuthSplitLayout";
import { forgotPassword } from "../../../services/authService";
import { ApiError } from "../../../services/apiClient";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { forgotPasswordSchema } from "../../../schemas/auth/forgotPasswordSchema";
import { buildForgotPasswordPayload } from "../../../utils/auth/authForm";

export default function ForgotPasswordPage() {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await forgotPassword(buildForgotPasswordPayload(values));
      success("Se o e-mail existir, enviaremos um link de redefinição.");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Não foi possível solicitar o reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      formTitle="Esqueci minha senha"
      formSubtitle="Informe seu e-mail para receber o link de redefinição."
    >
      <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
          Enviar link
        </LoadingButton>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Lembrou sua senha?{" "}
          <Link component={RouterLink} to="/login" fontWeight={700}>
            Voltar ao login
          </Link>
        </Typography>
      </Stack>
    </AuthSplitLayout>
  );
}
