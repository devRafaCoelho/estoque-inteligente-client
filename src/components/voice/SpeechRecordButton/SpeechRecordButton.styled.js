export const speechFieldRootSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

export const speechMicAdornmentSx = {
  alignSelf: "flex-end",
  maxHeight: "none",
  height: "auto",
  marginRight: 0.25,
  marginBottom: 0.5,
};

export const speechMicButtonSx = (listening) => ({
  color: listening ? "error.main" : "text.secondary",
  ...(listening
    ? {
        bgcolor: "error.main",
        color: "error.contrastText",
        "&:hover": { bgcolor: "error.dark" },
      }
    : null),
});

export const speechRecordHintSx = {
  color: "text.secondary",
};

export const speechRecordInterimSx = {
  color: "text.secondary",
  fontStyle: "italic",
};

export const speechRecordErrorSx = {
  color: "error.main",
};
