export const googleSignInContainerSx = (disabled) => ({
  width: "100%",
  opacity: disabled ? 0.6 : 1,
  pointerEvents: disabled ? "none" : "auto",
  display: "flex",
  justifyContent: "center",
  "& > div": { width: "100% !important" },
  "& iframe": { width: "100% !important" },
});
