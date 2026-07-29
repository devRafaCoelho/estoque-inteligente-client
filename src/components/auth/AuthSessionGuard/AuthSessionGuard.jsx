import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../../hooks/useAuth";
import { resolveSafeInternalPath } from "../../../utils/resolveSafeInternalPath";
import { AUTH_SESSION_GUARD_CONFIG } from "./authSessionGuardConfig";
import { authSessionBootBoxSx } from "./AuthSessionGuard.styled";

const PENDING_HOUSEHOLD_INVITE_KEY = "pendingHouseholdInviteToken";

function rememberHouseholdInviteToken(pathname, search) {
  if (!pathname.startsWith("/conta-familiar/convite")) return;
  const token = new URLSearchParams(search).get("token");
  if (token) {
    sessionStorage.setItem(PENDING_HOUSEHOLD_INVITE_KEY, token);
  }
}

export function PrivateRoute() {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <Box sx={authSessionBootBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    rememberHouseholdInviteToken(location.pathname, location.search);
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return (
      <Navigate
        to={`${AUTH_SESSION_GUARD_CONFIG.loginPath}?redirect=${redirect}`}
        replace
      />
    );
  }
  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, booting } = useAuth();
  const [searchParams] = useSearchParams();

  if (booting) {
    return (
      <Box sx={authSessionBootBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    // Após Google/login, o auth atualiza antes do navigate da página —
    // honrar ?redirect= evita mandar para o dashboard e pular o aceite do convite.
    let next = resolveSafeInternalPath(
      searchParams.get("redirect"),
      AUTH_SESSION_GUARD_CONFIG.dashboardPath,
    );
    if (next === AUTH_SESSION_GUARD_CONFIG.dashboardPath) {
      const pendingToken = sessionStorage.getItem(PENDING_HOUSEHOLD_INVITE_KEY);
      if (pendingToken) {
        next = `/conta-familiar/convite?token=${encodeURIComponent(pendingToken)}`;
      }
    }
    return <Navigate to={next} replace />;
  }
  return <Outlet />;
}
