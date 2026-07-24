/** Estilos específicos da StockOutPreviewPage. */

export const stockOutPreviewStackSpacing = 2.5;

export const lockedStackSpacing = 2;

export const allowZeroLabelSx = {
  display: "inline-flex",
  alignItems: "center",
  m: 0,
  gap: 1,
  "& .MuiCheckbox-root": {
    p: 0,
    m: 0,
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "0.8125rem",
    lineHeight: 1.25,
    m: 0,
    pt: "1px",
  },
};

// Evita quebra de HMR se algum módulo antigo ainda pedir estes nomes.
export const itemAccordionDetailsSx = {};
export const itemAccordionSummarySx = {};
export const itemAccordionSx = {};
export const itemInnerStackSpacing = 1.5;
export const itemListSpacing = 2;
export const itemSummaryChipsSx = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 0.75,
  useFlexGap: true,
};
export const itemSummaryMainSx = {};
export const itemSummaryTextSx = {};
export const itemSummaryMetaSx = {};
export const qtyUnitRowProps = {
  direction: "row",
  spacing: 1.5,
};
