export const quantityRowSpacing = 1.5;

export const unitSelectSx = {
  minWidth: 140,
  flexShrink: 0,
  width: { xs: "40%", sm: 160 },
};

export const stageListSpacing = 1;

export const stageItemSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
  gap: { xs: 0.5, sm: 2 },
  py: 1.25,
  px: 1.5,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

export const stageItemContentSx = {
  minWidth: 0,
  flex: 1,
};

export const stageItemActionsSx = {
  flexShrink: 0,
  ml: { xs: -0.75, sm: 0 },
  alignSelf: { xs: "flex-start", sm: "center" },
};

export const formSectionSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};
