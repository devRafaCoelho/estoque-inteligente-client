export const googleSignInWrapperSx = (disabled) => ({
  position: "relative",
  width: "100%",
  minHeight: 44,
  opacity: disabled ? 0.6 : 1,
});

/** Visual alinhado ao padrão Toolpad Sign-in (outlined full-width). */
export const googleSignInButtonSx = {
  width: "100%",
  color: "text.primary",
  borderColor: "rgba(0, 0, 0, 0.23)",
  bgcolor: "background.paper",
  justifyContent: "center",
  gap: 1,
  fontWeight: 700,
  cursor: "pointer",
  "&:hover": {
    borderColor: "text.primary",
    bgcolor: "grey.50",
  },
  "&.Mui-disabled": {
    cursor: "not-allowed",
  },
};

/**
 * Host do widget oficial do Google: cobre o botão MUI (invisível, mas clicável).
 * GIS exige elemento real/visível o suficiente; clip + pointer-events:none impede o fluxo.
 */
export const googleSignInHiddenHostSx = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  opacity: 0.01,
  overflow: "hidden",
  cursor: "pointer",
  "& > div": {
    width: "100% !important",
    height: "100% !important",
  },
  "& iframe": {
    width: "100% !important",
    minWidth: "100% !important",
    height: "100% !important",
  },
};

export const googleGlyphSx = {
  width: 20,
  height: 20,
  display: "block",
};
