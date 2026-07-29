import { CARD_BORDER_RADIUS_PX, cardBorderRadius } from "../../../styles/surfaceStyles";

/** Track cinza claro + opção ativa branca com sombra suave (radius padrão do projeto). */

const SEGMENTED_OPTION_RADIUS_PX = Math.max(CARD_BORDER_RADIUS_PX - 4, 8);

export const segmentedControlTrackSx = {
  borderRadius: cardBorderRadius,
  bgcolor: "action.hover",
  p: 0.5,
};

/**
 * Frame fixo no modo scrollable: radius/fundo ficam no viewport,
 * e o conteúdo rola por dentro sem “levar” as bordas arredondadas.
 */
export const segmentedControlScrollSx = {
  ...segmentedControlTrackSx,
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    height: 4,
  },
};

export function segmentedControlGroupSx({ stretch, scrollable }) {
  return {
    ...(scrollable
      ? {
          bgcolor: "transparent",
          p: 0,
          borderRadius: 0,
        }
      : segmentedControlTrackSx),
    gap: 0.5,
    width: stretch ? "100%" : "max-content",
    minWidth: scrollable ? "100%" : undefined,
    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: `${SEGMENTED_OPTION_RADIUS_PX}px !important`,
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
