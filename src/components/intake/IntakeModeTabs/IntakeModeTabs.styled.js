import { cardBorderRadius } from "../../../styles/surfaceStyles";

export const intakeModeTabsGroupSx = {
  borderRadius: cardBorderRadius,
  bgcolor: "action.hover",
  p: 0.5,
  gap: 0.5,
  "& .MuiToggleButtonGroup-grouped": {
    border: 0,
    borderRadius: `${cardBorderRadius} !important`,
    margin: 0,
  },
};

export const intakeModeTabSx = {
  flex: 1,
  textTransform: "none",
  fontWeight: 700,
  py: 1,
  "&.Mui-selected": {
    bgcolor: "background.paper",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    color: "primary.main",
    "&:hover": {
      bgcolor: "background.paper",
    },
  },
};
