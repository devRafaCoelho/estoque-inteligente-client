export const speechFieldRootSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

/** Mantém espaçamento à direita para mic/seta não colarem na borda. */
export const speechFieldInputSx = {
  "& .MuiOutlinedInput-root": {
    alignItems: "center",
    paddingRight: 1.25,
  },
};

export const speechMicAdornmentSx = {
  alignSelf: "center",
  maxHeight: "none",
  height: "auto",
  marginRight: 0.5,
  marginLeft: 0,
  display: "flex",
  alignItems: "center",
  gap: 0.5,
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

export const speechSubmitButtonSx = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  width: 32,
  height: 32,
  p: 0.5,
  "&:hover": {
    bgcolor: "primary.dark",
  },
  "&.Mui-disabled": {
    bgcolor: "action.disabledBackground",
    color: "action.disabled",
  },
};

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
