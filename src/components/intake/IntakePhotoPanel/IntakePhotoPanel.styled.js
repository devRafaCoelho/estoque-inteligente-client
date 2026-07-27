import { cardBorderRadius, listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const photoDropSx = {
  ...listItemSurfaceSx,
  borderStyle: "dashed",
  px: 2,
  py: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

export const photoActionsSx = {
  flexWrap: "wrap",
  justifyContent: "center",
  width: "100%",
  "& > *": {
    flex: { xs: "1 1 auto", sm: "0 0 auto" },
  },
};

export const photoPreviewWrapSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: cardBorderRadius,
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "action.hover",
  px: 1.5,
  py: 2,
  minHeight: 220,
  maxHeight: 420,
};

export const photoPreviewImgSx = {
  display: "block",
  width: "auto",
  maxWidth: "100%",
  maxHeight: 360,
  objectFit: "contain",
  borderRadius: 1,
  bgcolor: "background.paper",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

export const photoClearButtonSx = {
  position: "absolute",
  top: 10,
  right: 10,
  bgcolor: "background.paper",
  boxShadow: 1,
  "&:hover": {
    bgcolor: "background.paper",
  },
};

export const photoOverlaySx = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1.25,
  bgcolor: "rgba(0,0,0,0.55)",
  color: "common.white",
  px: 2,
};

export const photoSubmitRowSx = {
  width: "100%",
  alignItems: "stretch",
};

export const photoChangeButtonSx = {
  whiteSpace: "nowrap",
  flexShrink: 0,
  px: 2,
};

export const photoSubmitButtonSx = {
  flex: 1,
  minWidth: 0,
};

export const photoErrorActionsSx = {
  mt: 1.25,
  gap: 1,
};
