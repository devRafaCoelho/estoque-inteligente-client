import { cardBorderRadius } from "../../../styles/surfaceStyles";

export const sharedPageRootSx = {
  minHeight: "100dvh",
  bgcolor: "background.default",
  px: { xs: 2, sm: 3 },
  py: { xs: 2.5, sm: 4 },
};

export const sharedPageInnerSx = {
  width: "100%",
  maxWidth: 560,
  mx: "auto",
};

export const sharedBrandSx = {
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "primary.main",
  mb: 0.5,
};

/** Compacto: ícone + "Estimativa: R$ …" (igual à lista autenticada). */
export const sharedSpendBannerSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  width: "fit-content",
  maxWidth: "100%",
  boxSizing: "border-box",
  px: 1.5,
  py: 1.1,
  borderRadius: cardBorderRadius,
  border: "1px solid",
  borderColor: "primary.light",
  bgcolor: "rgba(31, 122, 77, 0.08)",
};
