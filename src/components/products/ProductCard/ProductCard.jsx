import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import StockStatusChip from "../StockStatusChip/StockStatusChip";
import { categoryLabel } from "../../../utils/categoryLabels";
import { formatQuantity } from "../../../utils/unitLabels";
import { PRODUCT_CARD_COPY } from "./productCardCopy";
import { PRODUCT_CARD_CONFIG } from "./productCardConfig";
import { actionAreaSx, cardContentSx, infoBoxSx, quantitySx } from "./ProductCard.styled";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(PRODUCT_CARD_CONFIG.detailPath(product.id))}
        sx={actionAreaSx}
      >
        <CardContent sx={cardContentSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={infoBoxSx}>
              <Typography variant="subtitle1" fontWeight={800} noWrap>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {categoryLabel(product.category)}
              </Typography>
            </Box>
            <StockStatusChip status={product.stockStatus} />
          </Stack>
          <Typography variant="h6" sx={quantitySx} fontWeight={800}>
            {formatQuantity(product.quantity, product.unit)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {PRODUCT_CARD_COPY.minLabel} {formatQuantity(product.minQuantity, product.unit)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
