import { Navigate, Outlet, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../../hooks/useAuth";
import { AUTH_SESSION_GUARD_CONFIG } from "./authSessionGuardConfig";
import { authSessionBootBoxSx } from "./AuthSessionGuard.styled";

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

  if (booting) {
    return (
      <Box sx={authSessionBootBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={AUTH_SESSION_GUARD_CONFIG.dashboardPath} replace />;
  }
  return <Outlet />;
}
