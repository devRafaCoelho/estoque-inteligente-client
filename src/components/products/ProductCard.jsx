import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import StockStatusChip from "./StockStatusChip";
import { categoryLabel } from "../../utils/categoryLabels";
import { formatQuantity } from "../../utils/unitLabels";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/produtos/${product.id}`)} sx={{ minHeight: 96 }}>
        <CardContent sx={{ py: 1.75, "&:last-child": { pb: 1.75 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={800} noWrap>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {categoryLabel(product.category)}
              </Typography>
            </Box>
            <StockStatusChip status={product.stockStatus} />
          </Stack>
          <Typography variant="h6" sx={{ mt: 1.25 }} fontWeight={800}>
            {formatQuantity(product.quantity, product.unit)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Mínimo: {formatQuantity(product.minQuantity, product.unit)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
