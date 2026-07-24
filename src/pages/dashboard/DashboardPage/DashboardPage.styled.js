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

export const statsRowSpacing = 1.5;

export const statsRowDirection = "row";

export const statsRowSx = {
  width: "100%",
};

export const statCardSx = {
  flex: 1,
  minWidth: 0,
  width: "100%",
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
