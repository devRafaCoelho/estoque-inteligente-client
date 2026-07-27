import { listItemSurfaceSx } from "../../../styles/surfaceStyles";

export const addProductButtonSx = {
  width: { xs: "100%", sm: "auto" },
  flexShrink: 0,
  alignSelf: { sm: "flex-start" },
};

export const stageListSpacing = 1;

export const stageItemSx = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  py: 1.25,
  px: 1.5,
  ...listItemSurfaceSx,
};

export const stageItemContentSx = {
  minWidth: 0,
  flex: 1,
};

export const stageItemActionsSx = {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
};
