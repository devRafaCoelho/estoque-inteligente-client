import { listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const pageStackSpacing = 3;

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
  ...listItemSurfaceSx,
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

/** Lista horizontal de meses (mesmo padrão visual das categorias). */
export const seriesRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  py: 0.75,
};

export const seriesBarTrackSx = categoryBarTrackSx;

export const seriesBarFillSx = categoryBarFillSx;

export const categoryMonthChipsSx = {
  display: "flex",
  flexWrap: "nowrap",
  gap: 1,
  overflowX: "auto",
  mb: 1.5,
  pb: 0.5,
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    height: 4,
  },
  "& > *": {
    flexShrink: 0,
  },
};

export const tipItemSx = {
  p: 1.5,
  ...listItemSurfaceSx,
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
