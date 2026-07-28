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
 * Host oculto do widget oficial do Google (só para emitir o credential).
 * O clique do usuário fica no botão MUI em largura total.
 */
export const googleSignInHiddenHostSx = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
  padding: 0,
  margin: -1,
  pointerEvents: "none",
};

export const googleGlyphSx = {
  width: 20,
  height: 20,
  display: "block",
};
