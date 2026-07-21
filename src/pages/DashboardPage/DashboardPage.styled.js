export const pageStackSpacing = 3;

export const statsRowSpacing = 1.5;

export const statsRowDirection = "row";

export const statsRowSx = {
  width: "100%",
};

export const actionsRowSx = {
  direction: { xs: "column", sm: "row" },
};

export const actionsRowSpacing = 1.5;

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
