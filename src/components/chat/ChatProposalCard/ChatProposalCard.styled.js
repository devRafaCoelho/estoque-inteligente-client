/** Estilos do ChatProposalCard. */

import { listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const proposalCardSx = {
  ...listItemSurfaceSx,
  mt: 1,
  px: 1.5,
  py: 1.25,
  maxWidth: "100%",
};

export const proposalCardTitleSx = {
  fontWeight: 700,
  mb: 0.35,
};

export const proposalCardBodySx = {
  color: "text.secondary",
  mb: 1,
};

export const proposalItemListSx = {
  m: 0,
  pl: 2,
  mb: 1.25,
};

export const proposalItemSx = {
  typography: "body2",
  color: "text.primary",
};
