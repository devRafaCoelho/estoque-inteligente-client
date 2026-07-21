export const headerAppBarSx = {
  bgcolor: "primary.dark",
  borderRadius: 0,
  zIndex: (t) => t.zIndex.drawer + 1,
};

export const headerToolbarSx = {
  gap: 2,
  position: "relative",
  minHeight: { xs: 56, sm: 64 },
  px: { xs: 1.5, md: 2 },
};

export const headerMenuButtonSx = {
  zIndex: 1,
};

export const headerLogoSx = (isMobile) => ({
  height: { xs: 36, sm: 42, md: 36 },
  width: "auto",
  maxWidth: { xs: "52vw", sm: 220, md: 200 },
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
});

export const headerActionsSx = {
  ml: "auto",
  display: "flex",
  alignItems: "center",
  gap: 1,
  zIndex: 1,
};

export const headerUserNameSx = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.85rem",
};

export const headerNotificationsButtonSx = {
  color: "white",
};

export const headerNotificationsBadgeSx = {
  "& .MuiBadge-badge": {
    bgcolor: "error.main",
    color: "white",
    fontWeight: 700,
  },
};

export const headerAvatarButtonSx = {
  p: 0.5,
};

export const headerAvatarSx = {
  bgcolor: "primary.main",
  width: 40,
  height: 40,
  fontSize: "0.85rem",
  fontWeight: 700,
  border: "2px solid rgba(255,255,255,0.4)",
};

export const desktopNavRootSx = {
  display: "flex",
  gap: 0.5,
  flexGrow: 1,
  alignItems: "center",
};

export const desktopNavButtonSx = (active) => ({
  color: "white",
  fontSize: "0.85rem",
  fontWeight: active ? 800 : 600,
  px: 1.5,
  py: 0.75,
  minWidth: "auto",
  bgcolor: active ? "rgba(255,255,255,0.18)" : "transparent",
  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
});

export const mobileDrawerPaperSx = {
  width: 300,
  borderRadius: 0,
};

export const mobileDrawerHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  py: 1.5,
  borderBottom: "1px solid",
  borderColor: "divider",
};

export const mobileDrawerLogoSx = {
  height: 36,
  width: "auto",
  maxWidth: 180,
  objectFit: "contain",
  display: "block",
  cursor: "pointer",
};

export const mobileDrawerListSx = {
  px: 1,
  py: 1.5,
};

export const mobileDrawerItemSx = {
  borderRadius: 2,
  mb: 0.5,
  "&.Mui-selected": {
    bgcolor: "rgba(31,122,77,0.12)",
    color: "primary.dark",
    "& .MuiListItemIcon-root": { color: "primary.main" },
  },
};

export const mobileDrawerItemIconSx = (active) => ({
  minWidth: 40,
  color: active ? "primary.main" : "text.secondary",
});

export const profileMenuPaperSx = {
  mt: 1,
  minWidth: 220,
  borderRadius: 2,
  boxShadow: "0 8px 30px rgba(15,61,40,0.18)",
};

export const profileMenuUserBoxSx = {
  px: 2,
  py: 1.5,
};

export const profileMenuItemSx = {
  gap: 1.5,
  py: 1.25,
};

export const profileMenuLogoutItemSx = {
  gap: 1.5,
  py: 1.25,
  color: "error.main",
};

export const logoutDialogActionsSx = {
  px: 3,
  pb: 2,
  gap: 1,
};

export const brandLockupRootSx = (centered, height, clickable = false) => ({
  display: "flex",
  alignItems: "center",
  gap: { xs: 1, sm: 1.25 },
  height: height ?? { xs: 44, sm: 52 },
  flexShrink: 0,
  cursor: clickable ? "pointer" : "default",
  ...(centered
    ? {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
      }
    : null),
});

export const brandLockupIconSx = {
  height: "100%",
  width: "auto",
  objectFit: "contain",
  display: "block",
};

export const brandLockupWordmarkSx = {
  height: "100%",
  width: "auto",
  maxWidth: { xs: "46vw", sm: 200, md: 240 },
  objectFit: "contain",
  display: "block",
};
