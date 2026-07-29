/** Estilos específicos da ShoppingListPage. */

export const shoppingListStackSpacing = 2.5;

export const listToolbarRowProps = {
  direction: { xs: "column", sm: "row" },
  spacing: 1,
  alignItems: { sm: "center" },
  justifyContent: "space-between",
};

export const addSectionSpacing = 1.5;

export const actionButtonSx = {
  width: { xs: "100%", sm: "auto" },
  alignSelf: { sm: "flex-start" },
};

/** Compartilhar — Button MUI puro; sobrescreve minHeight 44 do theme (desalinha startIcon). */
export const shareButtonDesktopSx = {
  display: { xs: "none", md: "inline-flex" },
  minHeight: 32,
  py: 0.5,
  lineHeight: 1.25,
  "& .MuiButton-startIcon": {
    display: "inline-flex",
    alignItems: "center",
    marginRight: 0.75,
  },
};

export const shareButtonMobileSx = {
  display: { xs: "inline-flex", md: "none" },
  minHeight: 32,
  py: 0.5,
  lineHeight: 1.25,
  "& .MuiButton-startIcon": {
    display: "inline-flex",
    alignItems: "center",
    marginRight: 0.75,
  },
};
