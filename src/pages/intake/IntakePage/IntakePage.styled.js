/** Estilos específicos da IntakePage (reutiliza pageStyles quando possível). */

import { listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const intakeFormStackSpacing = 2.5;

export const examplesRowSx = {
  direction: "row",
  flexWrap: "wrap",
  gap: 1,
};

export const draftsSectionSpacing = 1.25;

export const draftsHeaderRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
};

export const draftsHeaderTitleSx = {
  mb: 0,
  fontWeight: 700,
};

export const draftItemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 1.25,
  ...listItemSurfaceSx,
  cursor: "pointer",
  transition: "border-color 0.15s ease",
  "&:hover": {
    borderColor: "primary.main",
  },
};

export const draftItemBodySx = {
  flex: 1,
  minWidth: 0,
};

export const draftItemMetaSx = {
  mt: 0.25,
};
