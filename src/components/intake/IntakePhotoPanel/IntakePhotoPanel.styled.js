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
};

export const photoPreviewWrapSx = {
  position: "relative",
  borderRadius: cardBorderRadius,
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "action.hover",
  minHeight: 200,
};

export const photoPreviewImgSx = {
  display: "block",
  width: "100%",
  maxHeight: 360,
  objectFit: "contain",
  bgcolor: "background.default",
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

export const photoErrorActionsSx = {
  mt: 1.25,
  gap: 1,
};
