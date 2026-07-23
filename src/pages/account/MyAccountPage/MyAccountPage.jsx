import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
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
  const [linking, setLinking] = useState(false);
  const [preferences, setPreferences] = useState({
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
        setPreferences({
          notifyLowStock: data.preferences?.notifyLowStock !== false,
          notifyOutOfStock: data.preferences?.notifyOutOfStock !== false,
          notifyConsumptionNudge: data.preferences?.notifyConsumptionNudge !== false,
          consumptionNudgeDays:
            data.preferences?.consumptionNudgeDays ||
            MY_ACCOUNT_CONFIG.preferenceDefaults.consumptionNudgeDays,
        });
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
        notifyConsumptionNudge: data.preferences.notifyConsumptionNudge,
        consumptionNudgeDays: data.preferences.consumptionNudgeDays,
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
                <TextField
                  type="number"
                  label={MY_ACCOUNT_PAGE_COPY.consumptionNudgeDays}
                  helperText={MY_ACCOUNT_PAGE_COPY.consumptionNudgeDaysHelper}
                  disabled={!preferences.notifyConsumptionNudge}
                  value={preferences.consumptionNudgeDays}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      consumptionNudgeDays: e.target.value,
                    }))
                  }
                  inputProps={{
                    min: MY_ACCOUNT_CONFIG.nudgeDaysMin,
                    max: MY_ACCOUNT_CONFIG.nudgeDaysMax,
                  }}
                />
                <LoadingButton
                  variant="contained"
                  loading={savingPreferences}
                  onClick={savePreferences}
                >
                  {MY_ACCOUNT_PAGE_COPY.savePreferences}
                </LoadingButton>
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

      <EditProfileDialog
        open={modalPerfil}
        onClose={() => setModalPerfil(false)}
        onSubmit={onSalvarPerfil}
        submitting={savingProfile}
        user={user}
        onLookupError={error}
      />

      <ChangePasswordDialog
        open={modalSenha}
        onClose={() => setModalSenha(false)}
        onSubmit={onAlterarSenha}
        submitting={savingPassword}
      />

      <HeaderLogoutDialog
        open={modalLogout}
        onCancel={() => setModalLogout(false)}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </Stack>
  );
}
