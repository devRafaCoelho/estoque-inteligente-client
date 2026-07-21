import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatQuantity } from "../../utils/unitLabels";

/**
 * Mesmos dados/ações do checklist, visual de papel manuscrito.
 */
export default function PaperShoppingList({ items, onToggle, onDelete, busyId, title }) {
  return (
    <Box
      sx={{
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
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Caveat", cursive',
          fontSize: "2rem",
          fontWeight: 700,
          mb: 1.5,
          pl: 2,
        }}
      >
        {title || "Lista de compras"}
      </Typography>

      {!items?.length ? (
        <Typography sx={{ fontFamily: '"Caveat", cursive', fontSize: "1.4rem", pl: 2, opacity: 0.7 }}>
          Nada por aqui ainda…
        </Typography>
      ) : (
        <Stack spacing={0.25}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                pl: 1.5,
                minHeight: 36,
                opacity: item.checked ? 0.45 : 1,
              }}
            >
              <Checkbox
                checked={Boolean(item.checked)}
                disabled={busyId === item.id}
                onChange={() => onToggle(item)}
                size="small"
                sx={{
                  color: "#5b4636",
                  "&.Mui-checked": { color: "#5b4636" },
                }}
              />
              <Typography
                sx={{
                  flex: 1,
                  fontFamily: '"Caveat", cursive',
                  fontSize: "1.55rem",
                  lineHeight: 1.1,
                  textDecoration: item.checked ? "line-through" : "none",
                }}
              >
                {item.name}
                {item.suggestedQty != null
                  ? ` — ${formatQuantity(item.suggestedQty, item.unit)}`
                  : ""}
              </Typography>
              <IconButton
                size="small"
                aria-label="Remover item"
                disabled={busyId === item.id}
                onClick={() => onDelete(item)}
                sx={{ color: "#5b4636" }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
