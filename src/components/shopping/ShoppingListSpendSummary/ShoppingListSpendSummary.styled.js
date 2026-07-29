import { cardBorderRadius } from "../../../styles/surfaceStyles";

/** Estilos do resumo de estimativa da lista de compras. */

export const spendBannerSx = (hasEstimate) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  flex: "0 0 auto",
  width: "fit-content",
  maxWidth: "100%",
  boxSizing: "border-box",
  px: 1.5,
  py: 1.1,
  borderRadius: cardBorderRadius,
  border: "1px solid",
  borderColor: hasEstimate ? "primary.light" : "divider",
  bgcolor: hasEstimate ? "rgba(31, 122, 77, 0.08)" : "background.paper",
});

/** Painel de preços faltantes — cards e botão ocupam 100% da largura. */
export const spendMissingPanelSx = {
  width: "100%",
  boxSizing: "border-box",
  p: 1.5,
  borderRadius: cardBorderRadius,
  border: "1px solid",
  borderColor: "info.light",
  bgcolor: "rgba(2, 136, 209, 0.04)",
};

export const spendMissingHeaderSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  mb: 1.25,
};

export const spendMissingListSx = {
  width: "100%",
};

/** Mobile: nome+chip em cima, preço embaixo. Desktop: linha. */
export const spendMissingCardSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  gap: { xs: 1.25, sm: 1.5 },
  width: "100%",
  boxSizing: "border-box",
  p: 1.25,
  borderRadius: cardBorderRadius,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};

export const spendMissingInfoSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 0.5,
  minWidth: 0,
  width: { xs: "100%", sm: "auto" },
  flex: { sm: "1 1 auto" },
};

export const spendMissingNameSx = {
  minWidth: 0,
  maxWidth: "100%",
};

export const spendMissingPriceFieldSx = {
  width: "100%",
  flex: { sm: "0 0 168px" },
  maxWidth: { sm: 168 },
};
