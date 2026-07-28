import { useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import PasswordTextField from "../../../components/form/PasswordTextField/PasswordTextField";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout/AuthSplitLayout";
import { resetPassword } from "../../../services/authService";
import { ApiError } from "../../../services/apiClient";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { resetPasswordSchema } from "../../../schemas/auth/resetPasswordSchema";
import { buildResetPasswordPayload } from "../../../utils/auth/authForm";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    if (!token) return;
    setLoading(true);
    try {
      await resetPassword(buildResetPasswordPayload(token, values));
      success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      formTitle="Criar nova senha"
      formSubtitle="Defina uma nova senha para acessar sua conta."
    >
      {!token ? (
        <Stack spacing={2.5}>
          <Alert severity="warning">O link de redefinição está ausente ou inválido.</Alert>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            <Link component={RouterLink} to="/esqueci-senha" fontWeight={700}>
              Solicitar novo link
            </Link>
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <PasswordTextField
            label="Nova senha"
            autoComplete="new-password"
            error={errors.password}
            helperText={errors.password?.message}
            registerProps={register("password")}
          />
          <PasswordTextField
            label="Confirmar nova senha"
            autoComplete="new-password"
            error={errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            registerProps={register("confirmPassword")}
          />
          <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
            Redefinir senha
          </LoadingButton>
        </Stack>
      )}
    </AuthSplitLayout>
  );
}
