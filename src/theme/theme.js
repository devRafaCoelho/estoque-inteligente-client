import { createTheme } from "@mui/material/styles";
import { CARD_BORDER_RADIUS_PX } from "../styles/surfaceStyles";

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
    // lineHeight 1.75 (padrão MUI) deixa o glifo Nunito visualmente alto vs. o ícone
    button: { fontWeight: 700, textTransform: "none", lineHeight: 1 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.size !== "small"
            ? { minHeight: 56 }
            : null),
        }),
        notchedOutline: {
          // Safari/iOS: transição da legend gera notch desalinhado com o label
          "& legend": {
            transition: "none",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          "&.MuiInputLabel-shrink": {
            backgroundColor: "transparent",
            paddingInline: 0,
            marginLeft: 0,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          // Garante que start/endIcon batam o centro óptico do texto (Nunito)
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 0,
            marginBottom: 0,
            // Texto Nunito “sobe”; sobe o ícone na mesma medida
            transform: "translateY(-2px)",
            "& .MuiSvgIcon-root, & > *:nth-of-type(1)": {
              display: "block",
              margin: 0,
              verticalAlign: "unset",
            },
          },
        },
        startIcon: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        endIcon: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
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
          borderRadius: CARD_BORDER_RADIUS_PX,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        label: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          paddingTop: 0,
          paddingBottom: 0,
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
