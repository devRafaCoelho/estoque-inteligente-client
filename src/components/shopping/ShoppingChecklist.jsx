import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatQuantity } from "../../utils/unitLabels";

const ORIGIN_LABELS = {
  out_of_stock: "Zerado",
  low_stock: "Acabando",
  repurchase_time: "Recompra",
  manual: "Manual",
  ai: "IA",
};

const PRIORITY_COLOR = {
  high: "error",
  medium: "warning",
  low: "default",
};

export default function ShoppingChecklist({ items, onToggle, onDelete, busyId }) {
  if (!items?.length) {
    return (
      <Typography color="text.secondary">
        Lista vazia. Toque em “Gerar com regras” ou adicione um item.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.25,
            py: 1,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            opacity: item.checked ? 0.55 : 1,
          }}
        >
          <Checkbox
            checked={Boolean(item.checked)}
            disabled={busyId === item.id}
            onChange={() => onToggle(item)}
            sx={{ p: 0.5 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              fontWeight={700}
              sx={{ textDecoration: item.checked ? "line-through" : "none" }}
              noWrap
            >
              {item.name}
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
              {item.suggestedQty != null && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={formatQuantity(item.suggestedQty, item.unit)}
                />
              )}
              <Chip
                size="small"
                color={PRIORITY_COLOR[item.priority] || "default"}
                variant="outlined"
                label={ORIGIN_LABELS[item.origin] || item.origin}
              />
            </Stack>
          </Box>
          <IconButton
            size="small"
            aria-label="Remover item"
            disabled={busyId === item.id}
            onClick={() => onDelete(item)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
}
