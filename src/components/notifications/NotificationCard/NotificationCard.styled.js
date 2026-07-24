const TONE_STYLES = {
  error: {
    unreadBg: "rgba(211, 47, 47, 0.06)",
    unreadBorder: "error.light",
  },
  warning: {
    unreadBg: "rgba(237, 108, 2, 0.08)",
    unreadBorder: "warning.light",
  },
  primary: {
    unreadBg: "rgba(31, 122, 77, 0.06)",
    unreadBorder: "primary.light",
  },
  default: {
    unreadBg: "rgba(31, 122, 77, 0.06)",
    unreadBorder: "primary.light",
  },
};

export const notificationCardSx = (tone = "default", unread = false) => {
  const palette = TONE_STYLES[tone] || TONE_STYLES.default;
  return {
    p: 1.5,
    borderRadius: "16px",
    bgcolor: unread ? palette.unreadBg : "background.paper",
    border: "1px solid",
    borderColor: unread ? palette.unreadBorder : "divider",
    cursor: "default",
  };
};

export const notificationCardClickableSx = {
  cursor: "pointer",
  transition: "border-color 0.15s ease",
  "&:hover": {
    borderColor: "primary.main",
  },
};

export const notificationCardTitleSx = (unread) => ({
  fontWeight: unread ? 800 : 700,
});

export const notificationCardTimestampSx = {
  mt: 0.75,
  display: "block",
};

export const notificationCardActionsSx = {
  mt: 1,
  flexWrap: "wrap",
};

export const notificationCardActionsSpacing = 1;
