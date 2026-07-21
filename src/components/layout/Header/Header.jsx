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
import { HEADER_COPY } from "./headerCopy";
import { HEADER_PATHS } from "./headerConfig";
import { getInitials, isPathActive } from "./headerUtils";
import {
  headerActionsSx,
  headerAppBarSx,
  headerAvatarButtonSx,
  headerAvatarSx,
  headerLogoSx,
  headerMenuButtonSx,
  headerToolbarSx,
  headerUserNameSx,
} from "./Header.styled";

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
      <AppBar position="fixed" elevation={0} square sx={headerAppBarSx}>
        <Toolbar sx={headerToolbarSx}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              aria-label={HEADER_COPY.openMenuAria}
              sx={headerMenuButtonSx}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component="img"
            src={brandLogo}
            alt={HEADER_COPY.logoAlt}
            onClick={() => navigate(HEADER_PATHS.dashboard)}
            sx={headerLogoSx(isMobile)}
          />

          {!isMobile && (
            <HeaderDesktopNav
              items={mainNavItems}
              isActive={isActive}
              onNavigate={handleNavigate}
            />
          )}

          <Box sx={headerActionsSx}>
            {!isMobile && userDisplayName && (
              <Typography variant="body2" sx={headerUserNameSx}>
                {userDisplayName}
              </Typography>
            )}
            <Tooltip title={HEADER_COPY.avatarTooltip}>
              <IconButton
                onClick={(event) => setProfileAnchorEl(event.currentTarget)}
                sx={headerAvatarButtonSx}
              >
                <Avatar sx={headerAvatarSx}>{userInitials}</Avatar>
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
