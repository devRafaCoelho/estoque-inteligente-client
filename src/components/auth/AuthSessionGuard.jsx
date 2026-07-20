import { Navigate, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../hooks/useAuth";

export function PrivateRoute() {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
