/** Estilos do ShoppingChecklist. */

import { listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const checklistItemSx = (checked) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.25,
  py: 1,
  ...listItemSurfaceSx,
  opacity: checked ? 0.55 : 1,
});

export const checklistCheckboxSx = {
  p: 0.5,
};

export const checklistNameSx = (checked) => ({
  textDecoration: checked ? "line-through" : "none",
});

export const checklistChipsRowSx = {
  mt: 0.5,
};

export const checklistNameBoxSx = {
  flex: 1,
  minWidth: 0,
};
