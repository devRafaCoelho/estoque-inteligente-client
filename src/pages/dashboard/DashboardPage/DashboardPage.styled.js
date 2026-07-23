export const pageStackSpacing = 3;

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

export const heroCardSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 3,
  border: "1px solid",
  borderColor: "primary.light",
  bgcolor: "rgba(31,122,77,0.06)",
};

export const heroActionsSx = {
  mt: 2,
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 1.25,
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

export const alertItemSx = (unread) => ({
  p: 1.5,
  borderRadius: 2,
  bgcolor: unread ? "rgba(31,122,77,0.06)" : "background.paper",
  border: "1px solid",
  borderColor: unread ? "primary.light" : "divider",
});

export const alertItemTitleSx = {
  fontWeight: 700,
};

export const alertActionsSx = {
  mt: 1,
  flexWrap: "wrap",
};

export const alertActionsSpacing = 1;
