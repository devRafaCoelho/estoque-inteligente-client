import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { accountSchema, changePasswordSchema } from "../../schemas";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

export default function MyAccountPage() {
  const { user, updateSessionUser, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      name: user?.name || "",
      defaultState: user?.defaultState || "",
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const saveProfile = async (values) => {
    setSavingProfile(true);
    try {
      const data = await userService.updateMe(values);
      updateSessionUser(data.user);
      success("Perfil atualizado");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao atualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (values) => {
    setSavingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword || "",
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      success("Senha atualizada");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao trocar senha");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Stack spacing={3}>
      <BoxHeader email={user?.email} />

      <Stack spacing={2} component="form" onSubmit={profileForm.handleSubmit(saveProfile)}>
        <Typography variant="h6">Perfil</Typography>
        <TextField
          label="Nome"
          error={Boolean(profileForm.formState.errors.name)}
          helperText={profileForm.formState.errors.name?.message}
          {...profileForm.register("name")}
        />
        <TextField label="UF padrão" inputProps={{ maxLength: 2 }} {...profileForm.register("defaultState")} />
        <LoadingButton type="submit" variant="contained" loading={savingProfile}>
          Salvar perfil
        </LoadingButton>
      </Stack>

      <Divider />

      <Stack spacing={2} component="form" onSubmit={passwordForm.handleSubmit(savePassword)}>
        <Typography variant="h6">Senha</Typography>
        <TextField
          label="Senha atual"
          type="password"
          {...passwordForm.register("currentPassword")}
        />
        <TextField
          label="Nova senha"
          type="password"
          error={Boolean(passwordForm.formState.errors.newPassword)}
          helperText={passwordForm.formState.errors.newPassword?.message}
          {...passwordForm.register("newPassword")}
        />
        <TextField
          label="Confirmar nova senha"
          type="password"
          error={Boolean(passwordForm.formState.errors.confirmPassword)}
          helperText={passwordForm.formState.errors.confirmPassword?.message}
          {...passwordForm.register("confirmPassword")}
        />
        <LoadingButton type="submit" variant="outlined" loading={savingPassword}>
          Atualizar senha
        </LoadingButton>
      </Stack>

      <Divider />

      <Button
        color="inherit"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Sair da conta
      </Button>
    </Stack>
  );
}

function BoxHeader({ email }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h5">Minha conta</Typography>
      <Typography color="text.secondary">{email}</Typography>
    </Stack>
  );
}
