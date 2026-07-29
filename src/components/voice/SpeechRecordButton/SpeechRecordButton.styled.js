export const speechFieldRootSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

/**
 * @param {{ compact?: boolean }} [options]
 * compact = altura padrão do OutlinedInput médio (56px);
 * !compact = textarea com minRows > 1 (entrada/baixa).
 */
export const speechFieldInputSx = ({ compact = true } = {}) => ({
  "& .MuiOutlinedInput-root": {
    alignItems: "center",
    paddingRight: 0.75,
    ...(compact
      ? {
          minHeight: 56,
          paddingTop: 0,
          paddingBottom: 0,
        }
      : {
          alignItems: "flex-start",
          paddingTop: "10px",
          paddingBottom: "10px",
        }),
  },
  // Multiline compact (ex.: chat com minRows=1): mesma altura de um TextField padrão
  "& textarea.MuiOutlinedInput-input": compact
    ? {
        lineHeight: 1.4375,
        paddingTop: "16.5px",
        paddingBottom: "16.5px",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      }
    : {
        lineHeight: 1.4375,
        paddingTop: 0,
        paddingBottom: 0,
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
      },
});

/**
 * @param {{ compact?: boolean }} [options]
 */
export const speechMicAdornmentSx = ({ compact = true } = {}) => ({
  alignSelf: compact ? "center" : "flex-end",
  height: compact ? "100%" : "auto",
  maxHeight: compact ? 56 : "none",
  marginRight: 0.25,
  marginLeft: 0,
  marginTop: 0,
  marginBottom: compact ? 0 : 0.25,
  display: "flex",
  alignItems: "center",
  gap: 0.75,
});

export const speechMicButtonSx = (listening) => ({
  color: listening ? "error.contrastText" : "text.secondary",
  p: 0.5,
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
  flexShrink: 0,
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
