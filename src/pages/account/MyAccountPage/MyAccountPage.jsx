import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import GoogleSignInButton, {
  isGoogleAuthConfigured,
} from "../../../components/auth/GoogleSignInButton/GoogleSignInButton";
import AppleSignInButton, {
  isAppleAuthConfigured,
} from "../../../components/auth/AppleSignInButton/AppleSignInButton";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import HeaderLogoutDialog from "../../../components/layout/Header/components/HeaderLogoutDialog";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  changeMyPassword,
  getMyPreferences,
  updateMe,
  updateMyPreferences,
} from "../../../services/userService";
import {
  getPushConfig,
  getServiceWorkerRegistration,
  isPushSupported,
  subscribePush,
  unsubscribePush,
} from "../../../services/pushNotificationService";
import { resolveBrazilianStateLabel } from "../../../utils/entitySelectOptions";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import ChangePasswordDialog from "./components/ChangePasswordDialog";
import EditProfileDialog from "./components/EditProfileDialog";
import MyAccountResumoCard from "./components/MyAccountResumoCard";
import { MY_ACCOUNT_CONFIG } from "./myAccountConfig";
import { MY_ACCOUNT_PAGE_COPY, MY_ACCOUNT_RESUMO_COPY } from "./myAccountCopy";
import { buildUpdatePreferencesPayload } from "../../../utils/account/accountForm";
import {
  columnSx,
  layoutGridSx,
  pageStackSpacing,
  rightColumnStackSpacing,
  sectionCardContentSx,
} from "./MyAccountPage.styled";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function MyAccountPage() {
  const { user, updateSessionUser, logout, linkGoogle, linkApple } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savingPush, setSavingPush] = useState(false);
  const [linking, setLinking] = useState(false);
  const [preferences, setPreferences] = useState({
    ...MY_ACCOUNT_CONFIG.preferenceDefaults,
  });
  const [savedPreferences, setSavedPreferences] = useState({
    ...MY_ACCOUNT_CONFIG.preferenceDefaults,
  });

  const providers = user?.authProviders || [];
  const hasGoogle = providers.includes(MY_ACCOUNT_CONFIG.providers.google);
  const hasApple = providers.includes(MY_ACCOUNT_CONFIG.providers.apple);
  const canLinkSocial =
    (isGoogleAuthConfigured() && !hasGoogle) ||
    (isAppleAuthConfigured() && !hasApple);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const data = await getMyPreferences();
        if (!ativo) return;
        const nextPreferences = {
          notifyLowStock: data.preferences?.notifyLowStock !== false,
          notifyOutOfStock: data.preferences?.notifyOutOfStock !== false,
          notifyRepurchase: data.preferences?.notifyRepurchase !== false,
          notifyConsumptionNudge: data.preferences?.notifyConsumptionNudge !== false,
          notifyEmailDigest: Boolean(data.preferences?.notifyEmailDigest),
          pushEnabled: Boolean(data.preferences?.pushEnabled),
          consumptionNudgeDays:
            data.preferences?.consumptionNudgeDays ||
            MY_ACCOUNT_CONFIG.preferenceDefaults.consumptionNudgeDays,
          quietHoursEnabled: data.preferences?.quietHoursEnabled !== false,
          quietHoursStart:
            data.preferences?.quietHoursStart ||
            MY_ACCOUNT_CONFIG.preferenceDefaults.quietHoursStart,
          quietHoursEnd:
            data.preferences?.quietHoursEnd || MY_ACCOUNT_CONFIG.preferenceDefaults.quietHoursEnd,
          quietHoursTimezone:
            data.preferences?.quietHoursTimezone ||
            MY_ACCOUNT_CONFIG.preferenceDefaults.quietHoursTimezone,
        };
        setPreferences(nextPreferences);
        setSavedPreferences(nextPreferences);
      } catch (err) {
        if (ativo) {
          error(
            err instanceof ApiError
              ? err.message
              : MY_ACCOUNT_PAGE_COPY.preferencesLoadError,
          );
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, [error]);

  const onSalvarPerfil = useCallback(
    async (payload) => {
      setSavingProfile(true);
      try {
        const data = await updateMe(payload);
        updateSessionUser(data.user);
        setModalPerfil(false);
        success(MY_ACCOUNT_PAGE_COPY.profileSuccess);
      } catch (err) {
        error(
          err instanceof ApiError ? err.message : MY_ACCOUNT_PAGE_COPY.profileError,
        );
      } finally {
        setSavingProfile(false);
      }
    },
    [updateSessionUser, success, error],
  );

  const onAlterarSenha = useCallback(
    async (payload) => {
      setSavingPassword(true);
      try {
        await changeMyPassword(payload);
        success(MY_ACCOUNT_PAGE_COPY.passwordSuccess);
        setModalSenha(false);
      } catch (err) {
        error(
          err instanceof ApiError ? err.message : MY_ACCOUNT_PAGE_COPY.passwordError,
        );
      } finally {
        setSavingPassword(false);
      }
    },
    [success, error],
  );

  const savePreferences = async () => {
    setSavingPreferences(true);
    try {
      const data = await updateMyPreferences(
        buildUpdatePreferencesPayload(preferences),
      );
      setPreferences({
        notifyLowStock: data.preferences.notifyLowStock,
        notifyOutOfStock: data.preferences.notifyOutOfStock,
        notifyRepurchase: data.preferences.notifyRepurchase,
        notifyConsumptionNudge: data.preferences.notifyConsumptionNudge,
        notifyEmailDigest: data.preferences.notifyEmailDigest,
        pushEnabled: data.preferences.pushEnabled,
        consumptionNudgeDays: data.preferences.consumptionNudgeDays,
        quietHoursEnabled: data.preferences.quietHoursEnabled,
        quietHoursStart: data.preferences.quietHoursStart,
        quietHoursEnd: data.preferences.quietHoursEnd,
        quietHoursTimezone: data.preferences.quietHoursTimezone,
      });
      setSavedPreferences({
        notifyLowStock: data.preferences.notifyLowStock,
        notifyOutOfStock: data.preferences.notifyOutOfStock,
        notifyRepurchase: data.preferences.notifyRepurchase,
        notifyConsumptionNudge: data.preferences.notifyConsumptionNudge,
        notifyEmailDigest: data.preferences.notifyEmailDigest,
        pushEnabled: data.preferences.pushEnabled,
        consumptionNudgeDays: data.preferences.consumptionNudgeDays,
        quietHoursEnabled: data.preferences.quietHoursEnabled,
        quietHoursStart: data.preferences.quietHoursStart,
        quietHoursEnd: data.preferences.quietHoursEnd,
        quietHoursTimezone: data.preferences.quietHoursTimezone,
      });
      success(MY_ACCOUNT_PAGE_COPY.preferencesSuccess);
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : MY_ACCOUNT_PAGE_COPY.preferencesError,
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const handlePushToggle = async (enabled) => {
    if (!isPushSupported()) {
      error(MY_ACCOUNT_PAGE_COPY.pushUnsupported);
      return;
    }
    setSavingPush(true);
    try {
      const registration = await getServiceWorkerRegistration();
      if (enabled) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          error(MY_ACCOUNT_PAGE_COPY.pushDenied);
          return;
        }
        const config = await getPushConfig();
        if (!config.supported || !config.vapidPublicKey) {
          throw new Error("Push não configurado no servidor");
        }
        const result = await subscribePush(registration, config.vapidPublicKey);
        setPreferences((prev) => ({ ...prev, pushEnabled: result.pushEnabled }));
        setSavedPreferences((prev) => ({ ...prev, pushEnabled: result.pushEnabled }));
        success(MY_ACCOUNT_PAGE_COPY.pushEnabledSuccess);
      } else {
        const result = await unsubscribePush(registration);
        setPreferences((prev) => ({ ...prev, pushEnabled: result.pushEnabled }));
        setSavedPreferences((prev) => ({ ...prev, pushEnabled: result.pushEnabled }));
        success(MY_ACCOUNT_PAGE_COPY.pushDisabledSuccess);
      }
    } catch (err) {
      error(err instanceof ApiError ? err.message : err?.message || MY_ACCOUNT_PAGE_COPY.pushError);
    } finally {
      setSavingPush(false);
    }
  };

  const nudgeDays = Number(preferences.consumptionNudgeDays);
  const preferencesDirty =
    preferences.notifyLowStock !== savedPreferences.notifyLowStock ||
    preferences.notifyOutOfStock !== savedPreferences.notifyOutOfStock ||
    preferences.notifyRepurchase !== savedPreferences.notifyRepurchase ||
    preferences.notifyConsumptionNudge !== savedPreferences.notifyConsumptionNudge ||
    preferences.notifyEmailDigest !== savedPreferences.notifyEmailDigest ||
    preferences.quietHoursEnabled !== savedPreferences.quietHoursEnabled ||
    preferences.quietHoursStart !== savedPreferences.quietHoursStart ||
    preferences.quietHoursEnd !== savedPreferences.quietHoursEnd ||
    preferences.quietHoursTimezone !== savedPreferences.quietHoursTimezone ||
    Number(preferences.consumptionNudgeDays) !== Number(savedPreferences.consumptionNudgeDays);
  const canSavePreferences =
    preferencesDirty &&
    (!preferences.notifyConsumptionNudge ||
      (Number.isFinite(nudgeDays) &&
        nudgeDays >= MY_ACCOUNT_CONFIG.nudgeDaysMin &&
        nudgeDays <= MY_ACCOUNT_CONFIG.nudgeDaysMax));

  const handleLinkGoogle = async (idToken) => {
    setLinking(true);
    try {
      const data = await linkGoogle(idToken);
      success(
        data.linked
          ? MY_ACCOUNT_PAGE_COPY.googleLinked
          : MY_ACCOUNT_PAGE_COPY.googleAlreadyLinked,
      );
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : MY_ACCOUNT_PAGE_COPY.googleLinkError,
      );
      throw err;
    } finally {
      setLinking(false);
    }
  };

  const handleLinkApple = async ({ idToken, fullName }) => {
    setLinking(true);
    try {
      const data = await linkApple({ idToken, fullName });
      success(
        data.linked
          ? MY_ACCOUNT_PAGE_COPY.appleLinked
          : MY_ACCOUNT_PAGE_COPY.appleAlreadyLinked,
      );
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : MY_ACCOUNT_PAGE_COPY.appleLinkError,
      );
      throw err;
    } finally {
      setLinking(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      setModalLogout(false);
      logout();
      navigate(MY_ACCOUNT_CONFIG.paths.login);
    } finally {
      setLogoutLoading(false);
    }
  };

  const displayName = user?.name || "Usuário";
  const displayInitials = getInitials(displayName);
  const estadoLabel = user?.defaultState
    ? resolveBrazilianStateLabel(user.defaultState)
    : MY_ACCOUNT_RESUMO_COPY.emptyEstado;

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {MY_ACCOUNT_PAGE_COPY.title}
        </Typography>
        <Typography sx={pageHeaderSubtitleSx}>
          {MY_ACCOUNT_PAGE_COPY.subtitle}
        </Typography>
      </Box>

      <Box sx={layoutGridSx}>
        <Box sx={columnSx}>
          <MyAccountResumoCard
            displayName={displayName}
            displayInitials={displayInitials}
            email={user?.email}
            user={user}
            estadoLabel={estadoLabel}
            providers={providers}
            onEditarDados={() => setModalPerfil(true)}
            onAlterarSenha={() => setModalSenha(true)}
            onLogout={() => setModalLogout(true)}
          />
        </Box>

        <Box sx={columnSx}>
          <Stack spacing={rightColumnStackSpacing}>
            <Card>
              <CardContent sx={sectionCardContentSx}>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  {MY_ACCOUNT_PAGE_COPY.alertsTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {MY_ACCOUNT_PAGE_COPY.alertsSubtitle}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyLowStock}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          notifyLowStock: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.notifyLowStock}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyOutOfStock}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          notifyOutOfStock: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.notifyOutOfStock}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyRepurchase}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          notifyRepurchase: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.notifyRepurchase}
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
                  label={MY_ACCOUNT_PAGE_COPY.notifyConsumptionNudge}
                />
                <FormHelperText sx={{ mt: -0.5, mb: 0.5, mx: 0 }}>
                  {MY_ACCOUNT_PAGE_COPY.notifyConsumptionNudgeHelp}
                </FormHelperText>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyEmailDigest}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          notifyEmailDigest: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.notifyEmailDigest}
                />
                <TextField
                  type="number"
                  label={MY_ACCOUNT_PAGE_COPY.consumptionNudgeDays}
                  disabled={!preferences.notifyConsumptionNudge}
                  value={preferences.consumptionNudgeDays}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      consumptionNudgeDays: e.target.value,
                    }))
                  }
                  helperText={MY_ACCOUNT_PAGE_COPY.consumptionNudgeDaysHelp}
                  inputProps={{
                    min: MY_ACCOUNT_CONFIG.nudgeDaysMin,
                    max: MY_ACCOUNT_CONFIG.nudgeDaysMax,
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.quietHoursEnabled}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          quietHoursEnabled: e.target.checked,
                        }))
                      }
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.quietHoursEnabled}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
                  <TextField
                    type="time"
                    label={MY_ACCOUNT_PAGE_COPY.quietHoursStart}
                    disabled={!preferences.quietHoursEnabled}
                    value={preferences.quietHoursStart}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        quietHoursStart: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: { sm: 1 }, width: { xs: "100%", sm: "50%" } }}
                  />
                  <TextField
                    type="time"
                    label={MY_ACCOUNT_PAGE_COPY.quietHoursEnd}
                    disabled={!preferences.quietHoursEnabled}
                    value={preferences.quietHoursEnd}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        quietHoursEnd: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: { sm: 1 }, width: { xs: "100%", sm: "50%" } }}
                  />
                </Stack>
                <LoadingButton
                  variant="contained"
                  loading={savingPreferences}
                  disabled={!canSavePreferences}
                  onClick={savePreferences}
                >
                  {MY_ACCOUNT_PAGE_COPY.savePreferences}
                </LoadingButton>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={sectionCardContentSx}>
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  {MY_ACCOUNT_PAGE_COPY.pushTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {MY_ACCOUNT_PAGE_COPY.pushSubtitle}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.pushEnabled}
                      disabled={savingPush}
                      onChange={(e) => handlePushToggle(e.target.checked)}
                    />
                  }
                  label={MY_ACCOUNT_PAGE_COPY.pushEnabled}
                />
              </CardContent>
            </Card>

            {canLinkSocial && (
              <Card>
                <CardContent sx={sectionCardContentSx}>
                  <Typography variant="h6" fontWeight={700} color="primary.dark">
                    {MY_ACCOUNT_PAGE_COPY.linkSocialTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {MY_ACCOUNT_PAGE_COPY.linkSocialDescription}
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
                      label={MY_ACCOUNT_PAGE_COPY.linkAppleLabel}
                      onSuccess={handleLinkApple}
                      onError={(message) => error(message)}
                      disabled={linking}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </Box>

      {modalPerfil ? (
        <EditProfileDialog
          open={modalPerfil}
          onClose={() => setModalPerfil(false)}
          onSubmit={onSalvarPerfil}
          submitting={savingProfile}
          user={user}
          onLookupError={error}
        />
      ) : null}

      {modalSenha ? (
        <ChangePasswordDialog
          open={modalSenha}
          onClose={() => setModalSenha(false)}
          onSubmit={onAlterarSenha}
          submitting={savingPassword}
        />
      ) : null}

      <HeaderLogoutDialog
        open={modalLogout}
        onCancel={() => setModalLogout(false)}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </Stack>
  );
}
