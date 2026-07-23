export const rootSx = (sizeTokens) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  py: sizeTokens.py,
  px: sizeTokens.px,
  width: "100%",
});

export const iconWrapSx = (sizeTokens) => ({
  width: sizeTokens.iconWrap,
  height: sizeTokens.iconWrap,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 2,
  bgcolor: "rgba(31, 122, 77, 0.1)",
  color: "primary.main",
  flexShrink: 0,
});

export const iconSx = (sizeTokens) => ({
  fontSize: sizeTokens.iconFont,
});

export const imageSx = (sizeTokens) => ({
  maxWidth: "100%",
  maxHeight: sizeTokens.imageMaxHeight,
  objectFit: "contain",
  mb: 2,
  display: "block",
});

export const titleSx = {
  fontWeight: 700,
  color: "text.primary",
  mb: 0.75,
};

export const descriptionSx = {
  color: "text.secondary",
  maxWidth: 420,
  mx: "auto",
};

export const actionSx = {
  mt: 2.5,
};
