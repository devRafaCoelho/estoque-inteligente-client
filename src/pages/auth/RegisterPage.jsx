import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
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
import { registerSchema } from "../../schemas";
import { BRAZIL_STATES, getStateLabel } from "../../config/brazilStates";
import { useAuth } from "../../hooks/useAuth";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import LoadingButton from "../../components/common/LoadingButton";
import PasswordTextField from "../../components/form/PasswordTextField";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";
import { ApiError } from "../../services/apiClient";

const STEPS = ["Dados pessoais", "Acesso", "Confirmação"];

const DEFAULT_VALUES = {
  name: "",
  defaultState: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function isFilled(value) {
  return Boolean(String(value || "").trim());
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
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
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  });

  const watched = watch();
  const merged = useMemo(() => ({ ...allData, ...watched }), [allData, watched]);

  const canProceedStep0 = isFilled(watched.name) && isFilled(watched.defaultState);
  const canProceedStep1 =
    isFilled(watched.email) &&
    isFilled(watched.password) &&
    isFilled(watched.confirmPassword);
  const canProceed = activeStep === 0 ? canProceedStep0 : activeStep === 1 ? canProceedStep1 : true;
  const isLastStep = activeStep === STEPS.length - 1;

  const STEP_FIELDS = [
    ["name", "defaultState"],
    ["email", "password", "confirmPassword"],
  ];

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[activeStep]);
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
      if (data.isNewUser) success("Conta criada! Bem-vindo ao Estoque Inteligente.");
      else success("Cadastro realizado!");
      navigate("/dashboard");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      formTitle="Crie sua conta"
      formSubtitle="Cadastre seus dados em minutos"
      brandSubtitle="Cadastre-se e comece a controlar o estoque da casa"
    >
      <Stack spacing={2.5}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2} component="form" noValidate>
            <TextField
              label="Nome"
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register("name")}
            />
            <Controller
              name="defaultState"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Estado (UF)"
                  fullWidth
                  error={Boolean(errors.defaultState)}
                  helperText={errors.defaultState?.message}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {BRAZIL_STATES.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.code} — {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2} component="form" noValidate>
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
              autoComplete="new-password"
              error={errors.password}
              helperText={errors.password?.message || "Mínimo de 8 caracteres"}
              registerProps={register("password")}
            />
            <PasswordTextField
              label="Confirmar senha"
              autoComplete="new-password"
              error={errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              registerProps={register("confirmPassword")}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Box>
            <Stack alignItems="center" spacing={1} sx={{ mb: 2.5, textAlign: "center" }}>
              <CheckCircle color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" fontWeight={800}>
                Confirme seus dados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revise as informações antes de finalizar o cadastro
              </Typography>
            </Stack>
            <Stack spacing={1.25}>
              {[
                ["Nome", merged.name],
                ["Estado", getStateLabel(merged.defaultState)],
                ["E-mail", merged.email],
              ].map(([label, value]) => (
                <Stack
                  key={label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    {label}
                  </Typography>
                  <Chip label={value || "—"} size="small" />
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        <Stack direction="row" spacing={1.5}>
          {activeStep > 0 && (
            <Button variant="outlined" fullWidth onClick={handleBack}>
              Voltar
            </Button>
          )}
          {isLastStep ? (
            <LoadingButton
              variant="contained"
              fullWidth
              loading={loading}
              onClick={handleFinish}
            >
              Cadastrar
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleNext}
              disabled={!canProceed}
            >
              Continuar
            </Button>
          )}
        </Stack>

        {activeStep === 0 && (
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Já tem uma conta?{" "}
            <Link component={RouterLink} to="/login" fontWeight={700}>
              Faça login
            </Link>
          </Typography>
        )}
      </Stack>
    </AuthSplitLayout>
  );
}
