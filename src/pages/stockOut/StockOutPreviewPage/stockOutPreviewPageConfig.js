export const STOCK_OUT_PREVIEW_PAGE_CONFIG = {
  defaultUnit: "un",
  draftStatus: "draft",
  confirmedStatus: "confirmed",
  warningProductNotFound: "product_not_found",
  warningExceedsStock: "exceeds_stock",
  paths: {
    baixa: "/baixa",
    produtos: "/produtos",
  },
};

/** @deprecated mantido só por compatibilidade de HMR */
export function warningLabel(warning) {
  return warning || "";
}
