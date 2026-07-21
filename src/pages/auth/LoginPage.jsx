import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas";
import { useAuth } from "../../hooks/useAuth";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import LoadingButton from "../../components/common/LoadingButton";
import PasswordTextField from "../../components/form/PasswordTextField";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";
import SocialAuthButtons from "../../components/auth/SocialAuthButtons";
import { ApiError } from "../../services/apiClient";

function isFilled(value) {
  return Boolean(String(value || "").trim());
}

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const email = watch("email");
  const password = watch("password");
  const canSubmit = isFilled(email) && isFilled(password);

  const finishSocial = (data) => {
    if (data.isNewUser) success("Conta criada! Bem-vindo ao Estoque Inteligente.");
    else success("Login realizado!");
    navigate("/dashboard");
  };

  const handleGoogle = async (idToken) => {
    setLoading(true);
    try {
      const data = await loginWithGoogle(idToken);
      finishSocial(data);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Falha no login com Google");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async ({ idToken, fullName }) => {
    setLoading(true);
    try {
      const data = await loginWithApple({ idToken, fullName });
      finishSocial(data);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Falha no login com Apple");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values);
      success("Login realizado!");
      navigate("/dashboard");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      formTitle="Acesse sua conta"
      formSubtitle="Entre com Google, Apple ou e-mail e senha"
      brandSubtitle="Gerencie seu estoque doméstico com praticidade"
    >
      <Stack spacing={2.5}>
        <SocialAuthButtons
          disabled={loading}
          onGoogle={handleGoogle}
          onApple={handleApple}
          onError={(message) => error(message)}
        />

        <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <PasswordTextField
            label="Senha"
            autoComplete="current-password"
            error={errors.password}
            helperText={errors.password?.message}
            registerProps={register("password")}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={loading}
            disabled={!canSubmit}
          >
            Entrar
          </LoadingButton>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Não tem conta?{" "}
            <Link component={RouterLink} to="/cadastro" fontWeight={700}>
              Cadastre-se
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </AuthSplitLayout>
  );
}
