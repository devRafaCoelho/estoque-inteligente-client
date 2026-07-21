export const pageStackSpacing = 3;

export const toolbarRowProps = {
  direction: { xs: "column", sm: "row" },
  spacing: 1.5,
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
};

export const filterGroupSx = {
  flexWrap: "wrap",
};

export const listSpacing = 1.25;

export const alertCardSx = (unread) => ({
  p: 1.5,
  borderRadius: 2,
  bgcolor: unread ? "rgba(31,122,77,0.06)" : "background.paper",
  border: "1px solid",
  borderColor: unread ? "primary.light" : "divider",
  cursor: "default",
});

export const alertCardClickableSx = {
  cursor: "pointer",
  "&:hover": {
    borderColor: "primary.main",
  },
};

export const alertTitleSx = (unread) => ({
  fontWeight: unread ? 800 : 600,
});

export const alertActionsSx = {
  mt: 1,
  flexWrap: "wrap",
};

export const alertActionsSpacing = 1;
