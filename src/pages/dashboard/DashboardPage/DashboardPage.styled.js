export const pageStackSpacing = 3;

export const headerRowSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "stretch", md: "flex-start" },
  justifyContent: "space-between",
  gap: { xs: 0, md: 2 },
};

export const headerTextSx = {
  minWidth: 0,
  flex: 1,
};

export const headerIntakeActionsSx = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 1,
  alignItems: "center",
  justifyContent: { xs: "flex-start", md: "flex-end" },
  flexShrink: 0,
  pt: { md: 0.25 },
};

export const headerIntakeButtonSx = {
  whiteSpace: "nowrap",
};

export const statsRowSpacing = 1;

export const statsRowDirection = "row";

export const statsRowSx = {
  width: "100%",
};

export const statCardSx = {
  flex: 1,
  minWidth: 0,
  width: "100%",
  cursor: "pointer",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  "&:hover": {
    borderColor: "primary.light",
    boxShadow: 1,
  },
};

export const statCardContentSx = {
  py: 1.75,
  "&:last-child": { pb: 1.75 },
};

export const statValueSx = {
  mt: 1,
};

export const monthSpendCardSx = {
  width: "100%",
  cursor: "pointer",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  "&:hover": {
    borderColor: "primary.light",
    boxShadow: 1,
  },
};

export const assistantCardSx = {
  width: "100%",
  cursor: "pointer",
  borderColor: "primary.light",
  bgcolor: "action.hover",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: 1,
  },
};

export const assistantCardContentSx = {
  py: { xs: 1.5, md: 1.75 },
  px: { xs: 1.5, md: 2 },
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "stretch", md: "center" },
  justifyContent: "space-between",
  gap: { xs: 1.5, md: 2 },
  "&:last-child": { pb: { xs: 1.5, md: 1.75 } },
};

export const assistantCardTextSx = {
  minWidth: 0,
  flex: 1,
};

export const assistantCardTitleRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const assistantCardIconSx = {
  color: "primary.main",
  fontSize: 22,
  flexShrink: 0,
};

export const assistantCardDescriptionSx = {
  mt: 0.75,
  fontWeight: 800,
  lineHeight: 1.35,
  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
};

export const assistantCardCtaSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: { xs: "space-between", md: "flex-end" },
  gap: 0.5,
  color: "primary.main",
  flexShrink: 0,
  width: { xs: "100%", md: "auto" },
  pt: { xs: 1.25, md: 0 },
  mt: { xs: 0.25, md: 0 },
  borderTop: { xs: "1px solid", md: "none" },
  borderColor: { xs: "divider", md: "transparent" },
};

export const assistantCardCtaLabelSx = {
  fontWeight: 700,
  whiteSpace: "nowrap",
};

export const monthSpendContentSx = {
  py: 1.75,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  "&:last-child": { pb: 1.75 },
};

export const criticalListSpacing = 1.5;

export const alertsListSpacing = 1.25;

export const sectionTitleRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  mb: 1.5,
};

export const sectionTitleIconSx = {
  color: "text.secondary",
  fontSize: 22,
};

export const sectionTitleTextSx = {
  mb: 0,
  fontWeight: 700,
};
