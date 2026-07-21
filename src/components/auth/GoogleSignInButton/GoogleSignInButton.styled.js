export const googleSignInWrapperSx = (disabled) => ({
  position: "relative",
  width: "100%",
  minHeight: 44,
  opacity: disabled ? 0.6 : 1,
  pointerEvents: disabled ? "none" : "auto",
});

/** Visual alinhado ao padrão Toolpad Sign-in (outlined full-width). */
export const googleSignInButtonSx = {
  color: "text.primary",
  borderColor: "rgba(0, 0, 0, 0.23)",
  bgcolor: "background.paper",
  justifyContent: "center",
  gap: 1,
  fontWeight: 700,
  "&:hover": {
    borderColor: "text.primary",
    bgcolor: "grey.50",
  },
};

export const googleSignInOverlaySx = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  opacity: 0.02,
  overflow: "hidden",
  cursor: "pointer",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "stretch",
  "& > div": {
    width: "100% !important",
    height: "100% !important",
    display: "flex !important",
  },
  "& div[role='button']": {
    width: "100% !important",
    height: "100% !important",
    minHeight: "44px !important",
  },
  "& iframe": {
    width: "100% !important",
    height: "100% !important",
    minHeight: "44px !important",
  },
};

export const googleGlyphSx = {
  width: 20,
  height: 20,
  display: "block",
};
