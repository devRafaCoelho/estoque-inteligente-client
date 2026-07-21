import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { getStockStatusColor, getStockStatusLabel } from "../../../utils/stockStatus";
import { STOCK_STATUS_CHIP_CONFIG } from "./stockStatusChipConfig";
import { chipSx } from "./StockStatusChip.styled";

export default function StockStatusChip({ status, size = STOCK_STATUS_CHIP_CONFIG.defaultSize }) {
  const theme = useTheme();
  const color = getStockStatusColor(status, theme);

  return <Chip size={size} label={getStockStatusLabel(status)} sx={chipSx(color)} />;
}
