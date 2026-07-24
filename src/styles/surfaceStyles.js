/**
 * Tokens de superfície/card compartilhados.
 * Alinha Box “card-like” com o override de MuiCard no theme (16px).
 *
 * Atenção: em `sx`, `borderRadius: 2` NÃO é 16px — no MUI multiplica
 * `theme.shape.borderRadius` (hoje 14 → 28px).
 */

export const CARD_BORDER_RADIUS_PX = 16;
export const cardBorderRadius = `${CARD_BORDER_RADIUS_PX}px`;

/** Superfície branca com borda — itens de lista, seções, etc. */
export const listItemSurfaceSx = {
  borderRadius: cardBorderRadius,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};
