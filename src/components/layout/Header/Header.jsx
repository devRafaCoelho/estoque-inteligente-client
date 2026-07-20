import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import brandLogo from "../../../assets/brand-logo.png";
import { mainNavItems } from "../../../config/navigation";
import { useAuth } from "../../../hooks/useAuth";
import HeaderDesktopNav from "./components/HeaderDesktopNav";
import HeaderLogoutDialog from "./components/HeaderLogoutDialog";
import HeaderMobileDrawer from "./components/HeaderMobileDrawer";
import HeaderProfileMenu from "./components/HeaderProfileMenu";
import { HEADER_COPY, HEADER_PATHS } from "./headerCopy";
import { getInitials, isPathActive } from "./headerUtils";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const userDisplayName = user?.name || "";
  const userInitials = getInitials(userDisplayName) || HEADER_COPY.avatarFallback;

  const isActive = (path) => isPathActive(location.pathname, path);

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleMinhaConta = () => {
    handleProfileMenuClose();
    navigate(HEADER_PATHS.minhaConta);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      setLogoutDialogOpen(false);
      logout();
      navigate(HEADER_PATHS.login);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        square
        sx={{
          bgcolor: "primary.dark",
          borderRadius: 0,
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            gap: 2,
            position: "relative",
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1.5, md: 2 },
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label={HEADER_COPY.openMenuAria}
              sx={{ zIndex: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component="img"
            src={brandLogo}
            alt={HEADER_COPY.logoAlt}
            onClick={() => navigate(HEADER_PATHS.dashboard)}
            sx={{
              height: { xs: 36, sm: 42, md: 48 },
              width: "auto",
              maxWidth: { xs: "52vw", sm: 220, md: 260 },
              objectFit: "contain",
              display: "block",
              cursor: "pointer",
              flexShrink: 0,
              ...(isMobile
                ? {
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : { mr: 2 }),
            }}
          />

          {!isMobile && (
            <HeaderDesktopNav
              items={mainNavItems}
              isActive={isActive}
              onNavigate={handleNavigate}
            />
          )}

          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
              zIndex: 1,
            }}
          >
            {!isMobile && userDisplayName && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem" }}
              >
                {userDisplayName}
              </Typography>
            )}
            <Tooltip title={HEADER_COPY.avatarTooltip}>
              <IconButton
                onClick={(event) => setProfileAnchorEl(event.currentTarget)}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 40,
                    height: 40,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  {userInitials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <HeaderProfileMenu
        anchorEl={profileAnchorEl}
        onClose={handleProfileMenuClose}
        userDisplayName={userDisplayName}
        userEmail={user?.email}
        onMinhaConta={handleMinhaConta}
        onLogout={handleLogoutClick}
      />

      <HeaderLogoutDialog
        open={logoutDialogOpen}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />

      <HeaderMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={mainNavItems}
        isActive={isActive}
        onNavigate={handleNavigate}
      />
    </>
  );
}
