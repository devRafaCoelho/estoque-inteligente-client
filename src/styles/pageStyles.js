/**
 * Estilos compartilhados entre páginas (cabeçalhos, loading, toolbars).
 */

import { listItemSurfaceSx } from "./surfaceStyles";

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
  px: 2,
  pl: 2.5,
  py: 1.25,
  ...listItemSurfaceSx,
};

/** Alinha o bloco com o título ao lado do botão voltar. */
export const rawInputOffsetSx = {
  ml: { xs: 0, sm: 6 },
};

export const draftItemCardSx = (excluded, accentBorderColor = "primary.light") => ({
  p: 1.5,
  ...listItemSurfaceSx,
  borderColor: excluded ? "divider" : accentBorderColor,
  opacity: excluded ? 0.55 : 1,
});

export const flexGrowSpacerSx = {
  flex: 1,
};

export const exampleChipSx = {
  maxWidth: "100%",
};
