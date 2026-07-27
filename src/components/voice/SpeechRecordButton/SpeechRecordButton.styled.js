export const speechFieldRootSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

/** Aproxima o mic do canto inferior direito, com folga leve. */
export const speechFieldInputSx = {
  "& .MuiOutlinedInput-root": {
    paddingRight: 0.75,
    paddingBottom: 0.75,
  },
};

export const speechMicAdornmentSx = {
  alignSelf: "flex-end",
  maxHeight: "none",
  height: "auto",
  marginRight: 0.25,
  marginBottom: 0.25,
  marginLeft: 0,
};

export const speechMicButtonSx = (listening) => ({
  color: listening ? "error.contrastText" : "text.secondary",
  p: 0.75,
  ...(listening
    ? {
        bgcolor: "error.main",
        "&:hover": { bgcolor: "error.dark" },
        animation: "speechMicPulse 1.4s ease-in-out infinite",
        "@keyframes speechMicPulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.45)" },
          "50%": { boxShadow: "0 0 0 6px rgba(211, 47, 47, 0)" },
        },
      }
    : null),
});

export const speechStatusRowSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.25,
  minHeight: 0,
};

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
