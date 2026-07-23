import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../schemas";
import { resolveBrazilianStateLabel } from "../../../utils/entitySelectOptions";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import PasswordTextField from "../../../components/form/PasswordTextField/PasswordTextField";
import BrazilianStateSelectField from "../../../components/form/BrazilianStateSelectField";
import AuthSplitLayout from "../../../components/auth/AuthSplitLayout/AuthSplitLayout";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import { ApiError } from "../../../services/apiClient";
import { REGISTER_PAGE_CONFIG } from "./registerPageConfig";
import { REGISTER_PAGE_COPY } from "./registerPageCopy";
import {
  confirmationHeaderSx,
  confirmationIconSx,
  confirmationRowSx,
} from "./RegisterPage.styled";

function isFilled(value) {
  return Boolean(String(value || "").trim());
}

export default function RegisterPage() {
  const { register: registerUser, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: REGISTER_PAGE_CONFIG.formMode,
    defaultValues: REGISTER_PAGE_CONFIG.defaultValues,
  });

  const watched = watch();
  const merged = useMemo(() => ({ ...allData, ...watched }), [allData, watched]);

  const canProceedStep0 = isFilled(watched.name) && isFilled(watched.defaultState);
  const canProceedStep1 =
    isFilled(watched.email) &&
    isFilled(watched.password) &&
    isFilled(watched.confirmPassword);
  const canProceed = activeStep === 0 ? canProceedStep0 : activeStep === 1 ? canProceedStep1 : true;
  const isLastStep = activeStep === REGISTER_PAGE_COPY.steps.length - 1;

  const handleNext = async () => {
    const valid = await trigger(REGISTER_PAGE_CONFIG.stepFields[activeStep]);
    if (!valid) return;
    setAllData((prev) => ({ ...prev, ...getValues() }));
    setActiveStep((step) => step + 1);
  };

  const handleBack = () => setActiveStep((step) => step - 1);

  const handleFinish = async () => {
    const payload = { ...allData, ...getValues() };
    setLoading(true);
    try {
      const { confirmPassword, ...body } = payload;
      const data = await registerUser(body);
      if (data.isNewUser) success(REGISTER_PAGE_COPY.successNewUser);
      else success(REGISTER_PAGE_COPY.successRegister);
      navigate(REGISTER_PAGE_CONFIG.dashboardPath);
    } catch (err) {
      error(err instanceof ApiError ? err.message : REGISTER_PAGE_COPY.errorRegister);
    } finally {
      setLoading(false);
    }
  };

  const finishSocial = (data) => {
    if (data.isNewUser) success(REGISTER_PAGE_COPY.successNewUser);
    else success(REGISTER_PAGE_COPY.successLogin);
    navigate(REGISTER_PAGE_CONFIG.dashboardPath);
  };

  const handleGoogle = async (idToken) => {
    setLoading(true);
    try {
      const data = await loginWithGoogle(idToken);
      finishSocial(data);
    } catch (err) {
      error(err instanceof ApiError ? err.message : REGISTER_PAGE_COPY.errorGoogle);
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
      error(err instanceof ApiError ? err.message : REGISTER_PAGE_COPY.errorApple);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      formTitle={REGISTER_PAGE_COPY.formTitle}
      brandSubtitle={REGISTER_PAGE_COPY.brandSubtitle}
    >
      <Stack spacing={REGISTER_PAGE_CONFIG.stackSpacing}>
        {activeStep === 0 && (
          <SocialAuthButtons
            disabled={loading}
            onGoogle={handleGoogle}
            onApple={handleApple}
            onError={(message) => error(message)}
          />
        )}

        <Stepper activeStep={activeStep} alternativeLabel>
          {REGISTER_PAGE_COPY.steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2} component="form" noValidate>
            <TextField
              label={REGISTER_PAGE_COPY.nameLabel}
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register("name")}
            />
            <Controller
              name="defaultState"
              control={control}
              render={({ field }) => (
                <BrazilianStateSelectField
                  label={REGISTER_PAGE_COPY.stateLabel}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(errors.defaultState)}
                  helperText={errors.defaultState?.message}
                  required
                />
              )}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2} component="form" noValidate>
            <TextField
              label={REGISTER_PAGE_COPY.emailLabel}
              type="email"
              fullWidth
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register("email")}
            />
            <PasswordTextField
              label={REGISTER_PAGE_COPY.passwordLabel}
              autoComplete="new-password"
              error={errors.password}
              helperText={errors.password?.message || REGISTER_PAGE_COPY.passwordHelper}
              registerProps={register("password")}
            />
            <PasswordTextField
              label={REGISTER_PAGE_COPY.confirmPasswordLabel}
              autoComplete="new-password"
              error={errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              registerProps={register("confirmPassword")}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Box>
            <Stack alignItems="center" spacing={1} sx={confirmationHeaderSx}>
              <CheckCircle color="primary" sx={confirmationIconSx} />
              <Typography variant="h6" fontWeight={800}>
                {REGISTER_PAGE_COPY.confirmTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {REGISTER_PAGE_COPY.confirmSubtitle}
              </Typography>
            </Stack>
            <Stack spacing={1.25}>
              {[
                [REGISTER_PAGE_COPY.summaryName, merged.name],
                [REGISTER_PAGE_COPY.summaryState, resolveBrazilianStateLabel(merged.defaultState)],
                [REGISTER_PAGE_COPY.summaryEmail, merged.email],
              ].map(([label, value]) => (
                <Stack
                  key={label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={confirmationRowSx}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {label}
                  </Typography>
                  <Chip label={value || REGISTER_PAGE_COPY.emptyValue} size="small" />
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        <Stack direction="row" spacing={1.5}>
          {activeStep > 0 && (
            <Button variant="outlined" fullWidth onClick={handleBack}>
              {REGISTER_PAGE_COPY.back}
            </Button>
          )}
          {isLastStep ? (
            <LoadingButton
              variant="contained"
              fullWidth
              loading={loading}
              onClick={handleFinish}
            >
              {REGISTER_PAGE_COPY.submit}
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleNext}
              disabled={!canProceed}
            >
              {REGISTER_PAGE_COPY.continue}
            </Button>
          )}
        </Stack>

        {activeStep === 0 && (
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {REGISTER_PAGE_COPY.hasAccount}{" "}
            <Link
              component={RouterLink}
              to={REGISTER_PAGE_CONFIG.loginPath}
              fontWeight={700}
            >
              {REGISTER_PAGE_COPY.loginLink}
            </Link>
          </Typography>
        )}
      </Stack>
    </AuthSplitLayout>
  );
}
