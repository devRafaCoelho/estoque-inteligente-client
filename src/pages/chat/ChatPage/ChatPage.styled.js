import { cardBorderRadius, listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const pageStackSpacing = 2;

export const messagesBoxSx = {
  ...listItemSurfaceSx,
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  p: 1.5,
  minHeight: 280,
  maxHeight: { xs: "52vh", md: "58vh" },
  overflowY: "auto",
};

export const bubbleRowSx = (isUser) => ({
  display: "flex",
  justifyContent: isUser ? "flex-end" : "flex-start",
});

export const bubbleSx = (isUser) => ({
  maxWidth: "85%",
  px: 1.5,
  py: 1.1,
  borderRadius: cardBorderRadius,
  bgcolor: isUser ? "primary.main" : "action.hover",
  color: isUser ? "primary.contrastText" : "text.primary",
});

export const bubbleMetaSx = (isUser) => ({
  display: "block",
  mb: 0.35,
  opacity: isUser ? 0.85 : 1,
  color: isUser ? "inherit" : "text.secondary",
});

export const bubbleCtaSx = {
  mt: 1,
  textTransform: "none",
  alignSelf: "flex-start",
};

export const composerRowSx = {
  display: "flex",
  gap: 1,
  alignItems: "flex-end",
};

export const composerFieldSx = {
  flex: 1,
};
