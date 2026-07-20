import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { productService } from "../../services/productService";
import StockStatusChip from "../../components/products/StockStatusChip";
import ConsumeProductDialog from "../../components/products/ConsumeProductDialog";
import { categoryLabel } from "../../utils/categoryLabels";
import { formatQuantity } from "../../utils/unitLabels";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consumeOpen, setConsumeOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await productService.get(id);
      setProduct(data.product);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao carregar produto");
      navigate("/produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConsume = async ({ quantity, note }) => {
    try {
      await productService.consume(id, { quantity: Number(quantity), note });
      success("Baixa registrada");
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao dar baixa");
      throw err;
    }
  };

  const handleMarkOut = async () => {
    try {
      await productService.markOut(id);
      success("Produto marcado como acabou");
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao zerar produto");
    }
  };

  if (loading || !product) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => navigate("/produtos")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1 }}>
          {product.name}
        </Typography>
        <StockStatusChip status={product.stockStatus} />
      </Stack>

      <Box>
        <Typography variant="h3" fontWeight={800}>
          {formatQuantity(product.quantity, product.unit)}
        </Typography>
        <Typography color="text.secondary">
          {categoryLabel(product.category)} · mínimo {formatQuantity(product.minQuantity, product.unit)}
        </Typography>
        {product.notes && (
          <Typography sx={{ mt: 1 }} color="text.secondary">
            {product.notes}
          </Typography>
        )}
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
          variant="contained"
          disabled={Number(product.quantity) <= 0}
          onClick={() => setConsumeOpen(true)}
        >
          Dar baixa
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={Number(product.quantity) <= 0}
          onClick={handleMarkOut}
        >
          Marcar acabou
        </Button>
      </Stack>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Histórico
        </Typography>
        {(product.movements || []).length === 0 ? (
          <Typography color="text.secondary">Sem movimentos ainda.</Typography>
        ) : (
          <List disablePadding>
            {product.movements.map((m) => (
              <ListItem key={m.id} divider sx={{ px: 0 }}>
                <ListItemText
                  primary={`${m.type === "in" ? "+" : m.type === "out" ? "−" : "±"}${formatQuantity(m.quantity, m.unit)}`}
                  secondary={`${m.note || m.type} · ${new Date(m.createdAt).toLocaleString("pt-BR")}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <ConsumeProductDialog
        open={consumeOpen}
        onClose={() => setConsumeOpen(false)}
        product={product}
        onConfirm={handleConsume}
      />
    </Stack>
  );
}
