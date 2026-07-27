import { cardBorderRadius } from "../../../styles/surfaceStyles";

export const nfPanelStackSpacing = 2;

export const nfScannerWrapSx = {
  position: "relative",
  borderRadius: cardBorderRadius,
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "common.black",
  aspectRatio: "3 / 4",
  maxHeight: 420,
  width: "100%",
  minHeight: 260,
};

export const nfScannerVideoSx = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const nfScannerHintSx = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  px: 1.5,
  py: 1,
  bgcolor: "rgba(0,0,0,0.55)",
  color: "common.white",
  textAlign: "center",
  zIndex: 1,
};

export const nfOverlaySx = {
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
  zIndex: 2,
};
