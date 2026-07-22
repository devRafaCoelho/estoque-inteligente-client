export const bottomNavPaperSx = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: (theme) => theme.zIndex.appBar,
  display: { xs: "block", md: "none" },
  borderTop: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  pb: "env(safe-area-inset-bottom)",
};

export const bottomNavSx = {
  height: 64,
  bgcolor: "transparent",
  "& .MuiBottomNavigationAction-root": {
    minWidth: 0,
    px: 0.5,
    color: "text.secondary",
    "&.Mui-selected": {
      color: "primary.main",
    },
  },
};

export const bottomNavActionLabelSx = {
  fontSize: "0.7rem",
  fontWeight: 700,
};

export const bottomNavProminentIconWrapSx = (selected) => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: selected ? "primary.main" : "primary.dark",
  color: "primary.contrastText",
  mt: -1.5,
  boxShadow: selected ? 2 : 1,
});

export const moreSheetPaperSx = {
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  pb: "env(safe-area-inset-bottom)",
};

export const moreSheetHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  pt: 1.5,
  pb: 0.5,
};

export const moreSheetListSx = {
  py: 1,
};
