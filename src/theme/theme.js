import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f7a4d",
      light: "#2ea043",
      dark: "#0f3d28",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1e88e5",
    },
    background: {
      default: "#f3f6f4",
      paper: "#ffffff",
    },
    stock: {
      ok: "#2e7d32",
      low: "#ed6c02",
      out: "#d32f2f",
    },
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 44, borderRadius: 12 },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { boxShadow: "0 4px 14px rgba(27, 107, 74, 0.35)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          "&.Mui-selected": { color: "#1f7a4d" },
        },
      },
    },
  },
});

export default theme;
