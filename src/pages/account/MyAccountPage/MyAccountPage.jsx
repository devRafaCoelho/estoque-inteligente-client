import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { accountSchema, changePasswordSchema } from "../../../schemas";
import { useAuth } from "../../../hooks/useAuth";
import { userService } from "../../../services/userService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import GoogleSignInButton, {
  isGoogleAuthConfigured,
} from "../../../components/auth/GoogleSignInButton/GoogleSignInButton";
import AppleSignInButton, {
  isAppleAuthConfigured,
} from "../../../components/auth/AppleSignInButton/AppleSignInButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import BrazilianStateSelectField from "../../../components/form/BrazilianStateSelectField";
import { ApiError } from "../../../services/apiClient";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import { MY_ACCOUNT_COPY } from "./myAccountCopy";
import { MY_ACCOUNT_CONFIG } from "./myAccountConfig";
import {
  pageStackSpacing,
  formStackSpacing,
  linkSocialStackSpacing,
  headerStackSpacing,
  providersRowSx,
} from "./MyAccountPage.styled";

export default function MyAccountPage() {
  const { user, updateSessionUser, logout, linkGoogle, linkApple } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [linking, setLinking] = useState(false);
  const [preferences, setPreferences] = useState({ ...MY_ACCOUNT_CONFIG.preferenceDefaults });

  const providers = user?.authProviders || [];
  const hasGoogle = providers.includes(MY_ACCOUNT_CONFIG.providers.google);
  const hasApple = providers.includes(MY_ACCOUNT_CONFIG.providers.apple);
  const canLinkSocial =
    (isGoogleAuthConfigured() && !hasGoogle) || (isAppleAuthConfigured() && !hasApple);

  const profileForm = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      name: user?.name || MY_ACCOUNT_CONFIG.profileDefaults.name,
      defaultState: user?.defaultState || MY_ACCOUNT_CONFIG.profileDefaults.defaultState,
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: { ...MY_ACCOUNT_CONFIG.passwordDefaults },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await userService.getPreferences();
        if (!active) return;
        setPreferences({
          notifyLowStock: data.preferences?.notifyLowStock !== false,
          notifyOutOfStock: data.preferences?.notifyOutOfStock !== false,
          notifyConsumptionNudge: data.preferences?.notifyConsumptionNudge !== false,
          consumptionNudgeDays:
            data.preferences?.consumptionNudgeDays ||
            MY_ACCOUNT_CONFIG.preferenceDefaults.consumptionNudgeDays,
        });
      } catch (err) {
        if (active) {
          error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.preferencesLoadError);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [error]);

  const saveProfile = async (values) => {
    setSavingProfile(true);
    try {
      const data = await userService.updateMe(values);
      updateSessionUser(data.user);
      success(MY_ACCOUNT_COPY.profileSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.profileError);
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
      success(MY_ACCOUNT_COPY.passwordSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.passwordError);
    } finally {
      setSavingPassword(false);
    }
  };

  const savePreferences = async () => {
    setSavingPreferences(true);
    try {
      const data = await userService.updatePreferences({
        notifyLowStock: preferences.notifyLowStock,
        notifyOutOfStock: preferences.notifyOutOfStock,
        notifyConsumptionNudge: preferences.notifyConsumptionNudge,
        consumptionNudgeDays: Number(preferences.consumptionNudgeDays),
      });
      setPreferences({
        notifyLowStock: data.preferences.notifyLowStock,
        notifyOutOfStock: data.preferences.notifyOutOfStock,
        notifyConsumptionNudge: data.preferences.notifyConsumptionNudge,
        consumptionNudgeDays: data.preferences.consumptionNudgeDays,
      });
      success(MY_ACCOUNT_COPY.preferencesSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.preferencesError);
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleLinkGoogle = async (idToken) => {
    setLinking(true);
    try {
      const data = await linkGoogle(idToken);
      success(data.linked ? MY_ACCOUNT_COPY.googleLinked : MY_ACCOUNT_COPY.googleAlreadyLinked);
    } catch (err) {
      error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.googleLinkError);
      throw err;
    } finally {
      setLinking(false);
    }
  };

  const handleLinkApple = async ({ idToken, fullName }) => {
    setLinking(true);
    try {
      const data = await linkApple({ idToken, fullName });
      success(data.linked ? MY_ACCOUNT_COPY.appleLinked : MY_ACCOUNT_COPY.appleAlreadyLinked);
    } catch (err) {
      error(err instanceof ApiError ? err.message : MY_ACCOUNT_COPY.appleLinkError);
      throw err;
    } finally {
      setLinking(false);
    }
  };

  return (
    <Stack spacing={pageStackSpacing}>
      <BoxHeader email={user?.email} providers={providers} />

      <Stack spacing={formStackSpacing} component="form" onSubmit={profileForm.handleSubmit(saveProfile)}>
        <Typography variant="h6">{MY_ACCOUNT_COPY.profileTitle}</Typography>
        <TextField
          label={MY_ACCOUNT_COPY.nameLabel}
          error={Boolean(profileForm.formState.errors.name)}
          helperText={profileForm.formState.errors.name?.message}
          {...profileForm.register("name")}
        />
        <Controller
          name="defaultState"
          control={profileForm.control}
          render={({ field }) => (
            <BrazilianStateSelectField
              label={MY_ACCOUNT_COPY.defaultStateLabel}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={Boolean(profileForm.formState.errors.defaultState)}
              helperText={profileForm.formState.errors.defaultState?.message}
            />
          )}
        />
        <LoadingButton type="submit" variant="contained" loading={savingProfile}>
          {MY_ACCOUNT_COPY.saveProfile}
        </LoadingButton>
      </Stack>

      <Divider />

      <Stack spacing={formStackSpacing}>
        <Typography variant="h6">{MY_ACCOUNT_COPY.alertsTitle}</Typography>
        <Typography variant="body2" color="text.secondary">
          {MY_ACCOUNT_COPY.alertsSubtitle}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.notifyLowStock}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, notifyLowStock: e.target.checked }))
              }
            />
          }
          label={MY_ACCOUNT_COPY.notifyLowStock}
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.notifyOutOfStock}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, notifyOutOfStock: e.target.checked }))
              }
            />
          }
          label={MY_ACCOUNT_COPY.notifyOutOfStock}
        />
        <FormControlLabel
          control={
            <Switch
              checked={preferences.notifyConsumptionNudge}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  notifyConsumptionNudge: e.target.checked,
                }))
              }
            />
          }
          label={MY_ACCOUNT_COPY.notifyConsumptionNudge}
        />
        <TextField
          type="number"
          label={MY_ACCOUNT_COPY.consumptionNudgeDays}
          helperText={MY_ACCOUNT_COPY.consumptionNudgeDaysHelper}
          disabled={!preferences.notifyConsumptionNudge}
          value={preferences.consumptionNudgeDays}
          onChange={(e) =>
            setPreferences((prev) => ({ ...prev, consumptionNudgeDays: e.target.value }))
          }
          inputProps={{
            min: MY_ACCOUNT_CONFIG.nudgeDaysMin,
            max: MY_ACCOUNT_CONFIG.nudgeDaysMax,
          }}
        />
        <LoadingButton variant="contained" loading={savingPreferences} onClick={savePreferences}>
          {MY_ACCOUNT_COPY.savePreferences}
        </LoadingButton>
      </Stack>

      <Divider />

      {canLinkSocial && (
        <>
          <Stack spacing={linkSocialStackSpacing}>
            <Typography variant="h6">{MY_ACCOUNT_COPY.linkSocialTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {MY_ACCOUNT_COPY.linkSocialDescription}
            </Typography>
            {!hasGoogle && (
              <GoogleSignInButton
                onSuccess={handleLinkGoogle}
                onError={(message) => error(message)}
                disabled={linking}
              />
            )}
            {!hasApple && (
              <AppleSignInButton
                label={MY_ACCOUNT_COPY.linkAppleLabel}
                onSuccess={handleLinkApple}
                onError={(message) => error(message)}
                disabled={linking}
              />
            )}
          </Stack>
          <Divider />
        </>
      )}

      <Stack spacing={formStackSpacing} component="form" onSubmit={passwordForm.handleSubmit(savePassword)}>
        <Typography variant="h6">{MY_ACCOUNT_COPY.passwordTitle}</Typography>
        <TextField
          label={MY_ACCOUNT_COPY.currentPasswordLabel}
          type="password"
          {...passwordForm.register("currentPassword")}
        />
        <TextField
          label={MY_ACCOUNT_COPY.newPasswordLabel}
          type="password"
          error={Boolean(passwordForm.formState.errors.newPassword)}
          helperText={passwordForm.formState.errors.newPassword?.message}
          {...passwordForm.register("newPassword")}
        />
        <TextField
          label={MY_ACCOUNT_COPY.confirmPasswordLabel}
          type="password"
          error={Boolean(passwordForm.formState.errors.confirmPassword)}
          helperText={passwordForm.formState.errors.confirmPassword?.message}
          {...passwordForm.register("confirmPassword")}
        />
        <LoadingButton type="submit" variant="outlined" loading={savingPassword}>
          {MY_ACCOUNT_COPY.updatePassword}
        </LoadingButton>
      </Stack>

      <Divider />

      <Button
        color="inherit"
        onClick={() => {
          logout();
          navigate(MY_ACCOUNT_CONFIG.paths.login);
        }}
      >
        {MY_ACCOUNT_COPY.logout}
      </Button>
    </Stack>
  );
}

function BoxHeader({ email, providers }) {
  return (
    <Stack spacing={headerStackSpacing}>
      <Typography variant="h5">{MY_ACCOUNT_COPY.title}</Typography>
      <Typography sx={pageHeaderSubtitleSx}>{email}</Typography>
      {providers?.length > 0 && (
        <Stack
          direction={providersRowSx.direction}
          spacing={providersRowSx.spacing}
          flexWrap={providersRowSx.flexWrap}
          useFlexGap={providersRowSx.useFlexGap}
        >
          {providers.map((provider) => (
            <Chip key={provider} size="small" label={provider} color="primary" variant="outlined" />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
