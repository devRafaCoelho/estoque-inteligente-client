import { STOCK_OUT_PREVIEW_PAGE_COPY } from "./stockOutPreviewPageCopy";

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

export function warningLabel(warning) {
  if (warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningProductNotFound) {
    return STOCK_OUT_PREVIEW_PAGE_COPY.warningProductNotFound;
  }
  if (warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock) {
    return STOCK_OUT_PREVIEW_PAGE_COPY.warningExceedsStock;
  }
  return warning;
}
