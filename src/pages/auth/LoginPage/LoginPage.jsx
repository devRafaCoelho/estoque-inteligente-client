import { useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../schemas/auth/loginSchema";
import { buildLoginPayload } from "../../../utils/auth/authForm";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import PasswordTextField from "../../../components/form/PasswordTextField/PasswordTextField";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout/AuthSplitLayout";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import { ApiError } from "../../../services/apiClient";
import { socialAuthErrorMessage } from "../../../services/authService";
import { resolveSafeInternalPath } from "../../../utils/resolveSafeInternalPath";
import { LOGIN_PAGE_CONFIG } from "./loginPageConfig";
import { LOGIN_PAGE_COPY } from "./loginPageCopy";
import { isFilled } from "../../../utils/formValidation";

function isInvalidCredentialsError(err) {
  if (!(err instanceof ApiError) || err.status !== 401) return false;
  return String(err.message || "")
    .toLowerCase()
    .includes("credenciais");
}

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postLoginPath = resolveSafeInternalPath(
    searchParams.get("redirect"),
    LOGIN_PAGE_CONFIG.dashboardPath,
  );
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const [formAlert, setFormAlert] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: LOGIN_PAGE_CONFIG.defaultValues,
    mode: LOGIN_PAGE_CONFIG.formMode,
  });

  const email = watch("email");
  const password = watch("password");
  const canSubmit = isFilled(email) && isFilled(password);

  const clearFormAlert = () => {
    if (formAlert) setFormAlert("");
  };

  const finishSocial = (data) => {
    if (data.isNewUser) success(LOGIN_PAGE_COPY.successNewUser);
    else success(LOGIN_PAGE_COPY.successLogin);
    navigate(postLoginPath);
  };

  const handleGoogle = async (idToken) => {
    setLoading(true);
    setFormAlert("");
    try {
      const data = await loginWithGoogle(idToken);
      finishSocial(data);
    } catch (err) {
      error(socialAuthErrorMessage(err, LOGIN_PAGE_COPY.errorGoogle));
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async ({ idToken, fullName }) => {
    setLoading(true);
    setFormAlert("");
    try {
      const data = await loginWithApple({ idToken, fullName });
      finishSocial(data);
    } catch (err) {
      error(socialAuthErrorMessage(err, LOGIN_PAGE_COPY.errorApple));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setFormAlert("");
    try {
      await login(buildLoginPayload(values));
      success(LOGIN_PAGE_COPY.successLogin);
      navigate(postLoginPath);
    } catch (err) {
      if (isInvalidCredentialsError(err)) {
        setFormAlert(LOGIN_PAGE_COPY.errorInvalidCredentials);
      } else {
        setFormAlert(
          err instanceof ApiError
            ? err.message || LOGIN_PAGE_COPY.errorLogin
            : LOGIN_PAGE_COPY.errorLogin,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const emailRegister = register("email");
  const passwordRegister = register("password");

  return (
    <AuthSplitLayout
      formTitle={LOGIN_PAGE_COPY.formTitle}
      brandSubtitle={LOGIN_PAGE_COPY.brandSubtitle}
    >
      <Stack spacing={LOGIN_PAGE_CONFIG.stackSpacing}>
        <SocialAuthButtons
          disabled={loading}
          onGoogle={handleGoogle}
          onApple={handleApple}
          onError={(message) => error(message)}
        />

        <Stack
          spacing={LOGIN_PAGE_CONFIG.stackSpacing}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {formAlert ? (
            <Alert severity="error" role="alert" onClose={() => setFormAlert("")}>
              {formAlert}
            </Alert>
          ) : null}
          <TextField
            label={LOGIN_PAGE_COPY.emailLabel}
            type="email"
            fullWidth
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...emailRegister}
            onChange={(event) => {
              clearFormAlert();
              emailRegister.onChange(event);
            }}
          />
          <PasswordTextField
            label={LOGIN_PAGE_COPY.passwordLabel}
            autoComplete="current-password"
            error={errors.password}
            helperText={errors.password?.message}
            registerProps={{
              ...passwordRegister,
              onChange: (event) => {
                clearFormAlert();
                passwordRegister.onChange(event);
              },
            }}
          />
          <Typography variant="body2" textAlign="right">
            <Link component={RouterLink} to={LOGIN_PAGE_CONFIG.forgotPasswordPath} fontWeight={700}>
              {LOGIN_PAGE_COPY.forgotPassword}
            </Link>
          </Typography>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={loading}
            disabled={!canSubmit}
          >
            {LOGIN_PAGE_COPY.submit}
          </LoadingButton>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {LOGIN_PAGE_COPY.noAccount}{" "}
            <Link
              component={RouterLink}
              to={LOGIN_PAGE_CONFIG.registerPath}
              fontWeight={700}
            >
              {LOGIN_PAGE_COPY.signUpLink}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </AuthSplitLayout>
  );
}
