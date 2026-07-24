export const pageStackSpacing = 3;

export const summaryRowDirection = "column";

export const summaryRowSpacing = 1.5;

export const summaryRowSx = {
  width: "100%",
};

export const summaryCardSx = {
  width: "100%",
};

export const summaryCardContentSx = {
  py: 1.75,
  "&:last-child": { pb: 1.75 },
};

export const deltaSx = (positive) => ({
  color: positive ? "error.main" : "success.main",
  fontWeight: 700,
});

export const sectionCardSx = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "16px",
  bgcolor: "background.paper",
  p: 1.75,
};

export const categoryRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  py: 0.75,
};

export const categoryBarTrackSx = {
  height: 6,
  borderRadius: 999,
  bgcolor: "action.hover",
  overflow: "hidden",
  mt: 0.5,
};

export const categoryBarFillSx = (ratio) => ({
  width: `${Math.min(100, Math.max(0, ratio * 100))}%`,
  height: "100%",
  bgcolor: "primary.main",
});

export const seriesChartSx = {
  display: "flex",
  alignItems: "flex-end",
  gap: 1,
  height: 140,
  mt: 1.5,
};

export const seriesBarColumnSx = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  justifyContent: "flex-end",
  gap: 0.5,
};

export const seriesBarSx = (ratio) => ({
  width: "100%",
  maxWidth: 36,
  height: `${Math.max(4, ratio * 100)}%`,
  borderRadius: 1,
  bgcolor: "primary.main",
  opacity: 0.85,
});

export const tipItemSx = {
  p: 1.5,
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

export const recentItemSx = {
  display: "flex",
  justifyContent: "space-between",
  gap: 1,
  py: 1,
  borderBottom: "1px solid",
  borderColor: "divider",
  "&:last-child": { borderBottom: "none" },
};
