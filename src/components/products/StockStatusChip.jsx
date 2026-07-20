import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { getStockStatusColor, getStockStatusLabel } from "../../utils/stockStatus";

export default function StockStatusChip({ status, size = "small" }) {
  const theme = useTheme();
  const color = getStockStatusColor(status, theme);

  return (
    <Chip
      size={size}
      label={getStockStatusLabel(status)}
      sx={{
        bgcolor: `${color}18`,
        color,
        fontWeight: 700,
        borderRadius: 2,
      }}
    />
  );
}
