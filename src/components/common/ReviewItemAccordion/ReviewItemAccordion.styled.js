/** Estilos do ReviewItemAccordion (revisão de entrada/baixa). */

export const reviewItemWrapSx = {
  mb: 2,
  "&:last-child": {
    mb: 0,
  },
};

export const reviewItemAccordionSx = (accentBorderColor = "primary.light") => ({
  border: "1px solid",
  borderColor: accentBorderColor,
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "none",
  bgcolor: "background.paper",
  "&:before": { display: "none" },
  "&.Mui-expanded": {
    margin: "0 !important",
  },
  "&.MuiAccordion-root, &:first-of-type, &:last-of-type": {
    borderRadius: "16px",
  },
});

export const reviewItemSummarySx = {
  px: 1.5,
  minHeight: 64,
  gap: 1,
  alignItems: "center",
  "&.Mui-expanded": {
    minHeight: 64,
  },
  "& .MuiAccordionSummary-content": {
    my: 1.25,
    alignItems: "center",
    gap: 1,
    minWidth: 0,
    flex: 1,
    marginRight: 0,
    "&.Mui-expanded": {
      my: 1.25,
    },
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    margin: 0,
    alignSelf: "center",
  },
};

export const reviewItemDetailsSx = {
  px: 1.5,
  pt: 1.5,
  pb: 1.5,
};

export const reviewItemSummaryTextSx = {
  minWidth: 0,
  flex: 1,
};

export const reviewItemSummaryMetaSx = {
  color: "text.secondary",
};

export const reviewItemSummaryActionsSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  flexShrink: 0,
};

export const reviewItemFieldsSpacing = 1.5;

export const reviewItemQtyUnitRowProps = {
  direction: "row",
  spacing: 1.5,
};

// Evita quebra de HMR se algum módulo antigo ainda pedir este nome.
export const reviewItemDeleteSx = {};
export const reviewItemSummaryChipsSx = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 0.75,
  useFlexGap: true,
};
export const reviewItemSummaryMainSx = {
  minWidth: 0,
  flex: 1,
};
