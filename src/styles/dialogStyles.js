/**
 * Estilos compartilhados para MUI Dialog (formulários e modais).
 */

/** @param {boolean} isMobile */
export function responsiveDialogSx(isMobile) {
  return {
    "& .MuiDialog-container": {
      overflow: "hidden",
    },
    "& .MuiDialog-paper": {
      display: "flex",
      flexDirection: "column",
      maxHeight: isMobile ? "100%" : "90vh",
      overflow: "hidden",
    },
  };
}

export const dialogContentSx = {
  p: { xs: 2, sm: 3 },
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
};

export const dialogActionsSx = {
  px: { xs: 2, sm: 3 },
  py: 2,
  gap: 2,
  flexShrink: 0,
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: { sm: "flex-end" },
  "& .MuiButton-root": {
    width: { xs: "100%", sm: "auto" },
    m: 0,
  },
  "& > :not(style) + :not(style)": {
    ml: 0,
  },
};

/** @param {boolean} [isMobile] */
export function dialogTitleSx(isMobile = false) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    fontWeight: 700,
    color: "primary.dark",
    flexShrink: 0,
    ...(isMobile && { py: 2 }),
  };
}

export const cancelConfirmDialogSx = {
  zIndex: (theme) => theme.zIndex.modal + 2,
};

export const cancelConfirmDialogActionsSx = {
  px: 3,
  pb: 2,
  gap: 1.5,
  flexDirection: { xs: "column", md: "row" },
  justifyContent: { md: "flex-end" },
  "& .MuiButton-root": {
    whiteSpace: "nowrap",
    width: { xs: "100%", md: "auto" },
    m: 0,
  },
  "& > :not(style) + :not(style)": {
    ml: 0,
  },
};

export const formFieldsStackSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
};
