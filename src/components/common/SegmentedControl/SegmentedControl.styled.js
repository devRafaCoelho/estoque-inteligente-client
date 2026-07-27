/** Track pill cinza claro + opção ativa branca com sombra suave. */

export const segmentedControlTrackSx = {
  borderRadius: 999,
  bgcolor: "action.hover",
  p: 0.5,
};

export const segmentedControlScrollSx = {
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  pb: 0.25,
  "&::-webkit-scrollbar": {
    height: 4,
  },
};

export function segmentedControlGroupSx({ stretch, scrollable }) {
  return {
    ...segmentedControlTrackSx,
    gap: 0.5,
    width: stretch ? "100%" : "max-content",
    minWidth: scrollable ? "100%" : undefined,
    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: "999px !important",
      margin: 0,
    },
  };
}

export function segmentedOptionSx({ stretch, scrollable }) {
  return {
    flex: stretch ? 1 : "0 0 auto",
    minWidth: scrollable ? 72 : undefined,
    px: scrollable ? 1.75 : 1.25,
    textTransform: "none",
    fontWeight: 700,
    py: 1,
    color: "text.secondary",
    whiteSpace: "nowrap",
    "&.Mui-selected": {
      bgcolor: "background.paper",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      color: "primary.main",
      "&:hover": {
        bgcolor: "background.paper",
      },
    },
  };
}
