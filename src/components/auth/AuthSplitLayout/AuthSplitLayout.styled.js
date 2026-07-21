export const authSplitRootSx = (theme, isMobile) => ({
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: isMobile
    ? theme.palette.background.default
    : `linear-gradient(90deg, ${theme.palette.primary.dark} 50%, ${theme.palette.background.default} 50%)`,
  p: { xs: 0, md: 3 },
});

export const authSplitPaperSx = (theme) => ({
  width: "100%",
  maxWidth: { xs: "100%", md: 960 },
  minHeight: { xs: "100dvh", md: 560 },
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  overflow: "hidden",
  borderRadius: { xs: 0, md: 4 },
  border: "none",
  outline: "none",
  background: {
    xs: theme.palette.background.paper,
    md: `linear-gradient(90deg, ${theme.palette.primary.dark} 46%, ${theme.palette.background.paper} 46%)`,
  },
  bgcolor: "transparent",
  boxShadow: {
    xs: "none",
    md: "0 18px 48px rgba(15, 61, 40, 0.28)",
  },
});

export const authSplitBrandPanelSx = (theme, isMobile) => ({
  flex: { md: "0 0 46%" },
  alignSelf: "stretch",
  background: isMobile
    ? `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, #0b1220 55%, #122018 100%)`
    : `linear-gradient(160deg, #0b1220 0%, ${theme.palette.primary.dark} 55%, #163528 100%)`,
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: { xs: "center", md: "flex-start" },
  textAlign: { xs: "center", md: "left" },
  px: { xs: 3, sm: 4, md: 5 },
  py: { xs: 3.5, md: 5 },
  position: "relative",
  overflow: "hidden",
  border: "none",
});

export const authSplitBrandGlowSx = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 20% 20%, rgba(46,160,67,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(33,150,243,0.18), transparent 40%)",
  pointerEvents: "none",
};

/** Logo completa (ícone + wordmark) em todos os breakpoints. */
export const authSplitBrandLogoSx = {
  position: "relative",
  width: "100%",
  maxWidth: { xs: 280, sm: 320, md: 340 },
  height: "auto",
  objectFit: "contain",
  mb: { xs: 1.5, md: 2.5 },
  filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.45))",
};

export const authSplitBrandSubtitleSx = {
  position: "relative",
  mt: 0.5,
  opacity: 0.9,
  maxWidth: 360,
  lineHeight: 1.45,
  fontSize: { xs: "0.95rem", md: "1rem" },
};

export const authSplitFeaturesStackSx = {
  position: "relative",
  mt: 4,
  width: "100%",
  maxWidth: 360,
};

export const authSplitFeatureItemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
};

export const authSplitFeatureIconSx = {
  fontSize: 20,
  color: "primary.light",
  opacity: 0.95,
  flexShrink: 0,
};

export const authSplitFeatureTextSx = {
  opacity: 0.92,
  lineHeight: 1.45,
  fontWeight: 600,
  letterSpacing: "0.01em",
};

export const authSplitFormPanelSx = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  px: { xs: 3, sm: 4, md: 6 },
  py: { xs: 3, md: 5 },
  mt: { xs: -2, md: 0 },
  bgcolor: "background.paper",
  borderRadius: { xs: "24px 24px 0 0", md: 0 },
  position: "relative",
  zIndex: 1,
  boxShadow: { xs: "0 -8px 24px rgba(0,0,0,0.12)", md: "none" },
};

export const authSplitFormHeaderSx = {
  mb: 3,
  textAlign: { xs: "center", md: "left" },
};

export const authSplitFormSubtitleSx = {
  mt: 0.75,
};
