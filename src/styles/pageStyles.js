/**
 * Estilos compartilhados entre páginas (cabeçalhos, loading, toolbars).
 */

export const pageLoadingBoxSx = {
  display: "grid",
  placeItems: "center",
  py: 8,
};

export const pageLoadingCompactSx = {
  display: "grid",
  placeItems: "center",
  py: 6,
};

export const pageHeaderSectionSx = {
  mb: 0,
};

export const pageHeaderTitleSx = {
  fontWeight: 800,
};

export const pageHeaderSubtitleSx = {
  color: "text.secondary",
};

export const pageToolbarRowSx = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
};

export const pageToolbarActionsSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  flexShrink: 0,
};

export const pageSectionTitleSx = {
  mb: 1.5,
  fontWeight: 700,
};

export const pageBackHeaderSx = {
  flex: 1,
  minWidth: 0,
};

export const rawInputBoxSx = {
  px: 1.5,
  py: 1.25,
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};

export const draftItemCardSx = (excluded, accentBorderColor = "primary.light") => ({
  p: 1.5,
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: excluded ? "divider" : accentBorderColor,
  opacity: excluded ? 0.55 : 1,
});

export const flexGrowSpacerSx = {
  flex: 1,
};

export const exampleChipSx = {
  maxWidth: "100%",
};
