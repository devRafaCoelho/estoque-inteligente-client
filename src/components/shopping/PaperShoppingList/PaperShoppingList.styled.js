import { PAPER_SHOPPING_LIST_CONFIG } from "./paperShoppingListConfig";

/** Estilos do PaperShoppingList (visual de papel manuscrito). */

export const paperRootSx = {
  position: "relative",
  px: { xs: 2, sm: 3 },
  py: 2.5,
  borderRadius: 1,
  bgcolor: "#f7f1e3",
  color: "#2c2416",
  boxShadow: "0 10px 28px rgba(44, 36, 22, 0.12)",
  backgroundImage:
    "repeating-linear-gradient(transparent, transparent 31px, rgba(90, 70, 40, 0.12) 32px)",
  backgroundPosition: "0 12px",
  minHeight: 280,
  "&::before": {
    content: '""',
    position: "absolute",
    left: 28,
    top: 0,
    bottom: 0,
    width: 2,
    bgcolor: "rgba(196, 80, 80, 0.35)",
  },
};

export const paperTitleSx = {
  fontFamily: '"Caveat", cursive',
  fontSize: "2rem",
  fontWeight: 700,
  mb: 1.5,
  pl: 2,
};

export const paperEmptySx = {
  fontFamily: '"Caveat", cursive',
  fontSize: "1.4rem",
  pl: 2,
  opacity: 0.7,
};

export const paperItemRowSx = (checked) => ({
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  pl: 1.5,
  minHeight: 36,
  opacity: checked ? 0.45 : 1,
});

export const paperCheckboxSx = {
  color: PAPER_SHOPPING_LIST_CONFIG.paperInk,
  "&.Mui-checked": { color: PAPER_SHOPPING_LIST_CONFIG.paperInk },
};

export const paperItemTextSx = (checked) => ({
  flex: 1,
  fontFamily: '"Caveat", cursive',
  fontSize: "1.55rem",
  lineHeight: 1.1,
  textDecoration: checked ? "line-through" : "none",
});

export const paperDeleteSx = {
  color: PAPER_SHOPPING_LIST_CONFIG.paperInk,
};
