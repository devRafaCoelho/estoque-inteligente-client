import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UndoIcon from "@mui/icons-material/Undo";
import { UNIT_LABELS } from "../../config/constants";
import { stockOutService } from "../../services/stockOutService";
import { productService } from "../../services/productService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";
import { formatQuantity } from "../../utils/unitLabels";

function warningLabel(warning) {
  if (warning === "product_not_found") return "Produto não encontrado";
  if (warning === "exceeds_stock") return "Quantidade maior que o estoque";
  return warning;
}

export default function StockOutPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [stockOut, setStockOut] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [draft, catalog] = await Promise.all([
        stockOutService.get(id),
        productService.list({ active: true }),
      ]);
      setStockOut(draft.stockOut);
      setItems(draft.stockOut.items || []);
      setProducts(catalog.products || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao carregar preview");
      navigate("/baixa");
    } finally {
      setLoading(false);
    }
  }, [id, error, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = useMemo(() => items.filter((item) => !item.excluded).length, [items]);

  const updateItem = (itemId, patch) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const next = { ...item, ...patch };
        if (patch.productId !== undefined) {
          const product = products.find((p) => p.id === patch.productId);
          next.matchedExisting = Boolean(patch.productId);
          next.availableQty = product ? product.quantity : null;
          if (product && !patch.name) next.name = product.name;
          if (product && !patch.unit) next.unit = product.unit;
        }
        if (
          next.productId &&
          next.availableQty != null &&
          Number(next.quantity) > Number(next.availableQty)
        ) {
          next.warning = "exceeds_stock";
        } else if (!next.productId) {
          next.warning = "product_not_found";
        } else {
          next.warning = null;
        }
        return next;
      }),
    );
  };

  const buildPayload = () => ({
    items: items.map((item, index) => ({
      id: item.id,
      productId: item.productId || null,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      excluded: Boolean(item.excluded),
      allowZero: Boolean(item.allowZero),
      confidence: item.confidence ?? null,
      matchedExisting: Boolean(item.matchedExisting),
      availableQty: item.availableQty ?? null,
      warning: item.warning || null,
      sortOrder: index,
    })),
  });

  const handleConfirm = async () => {
    if (activeCount === 0) {
      error("Selecione ao menos um item para confirmar");
      return;
    }
    const unresolved = items.filter((item) => !item.excluded && !item.productId);
    if (unresolved.length) {
      error("Vincule um produto para todos os itens ativos");
      return;
    }
    setConfirming(true);
    try {
      const data = await stockOutService.confirm(id, buildPayload());
      success(`Baixa confirmada (${data.products?.length || activeCount} itens)`);
      navigate("/produtos");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao confirmar baixa");
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await stockOutService.cancel(id);
      success("Baixa cancelada");
      navigate("/baixa");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao cancelar");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stockOut) return null;

  if (stockOut.status !== "draft") {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">
          Baixa {stockOut.status === "confirmed" ? "confirmada" : "cancelada"}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/produtos")}>
          Ver produtos
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => navigate("/baixa")} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">Conferir baixa</Typography>
          <Typography variant="body2" color="text.secondary">
            Revise antes de descontar do estoque
          </Typography>
        </Box>
      </Stack>

      {stockOut.rawInput && (
        <Alert severity="info" variant="outlined">
          {stockOut.rawInput}
        </Alert>
      )}

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: item.excluded ? "divider" : "warning.light",
              opacity: item.excluded ? 0.55 : 1,
            }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                {item.warning && (
                  <Chip
                    size="small"
                    color={item.warning === "exceeds_stock" ? "warning" : "error"}
                    label={warningLabel(item.warning)}
                  />
                )}
                {item.availableQty != null && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`Estoque: ${formatQuantity(item.availableQty, item.unit)}`}
                  />
                )}
                <Box sx={{ flex: 1 }} />
                <IconButton
                  size="small"
                  onClick={() => updateItem(item.id, { excluded: !item.excluded })}
                >
                  {item.excluded ? <UndoIcon fontSize="small" /> : <DeleteOutlineIcon fontSize="small" />}
                </IconButton>
              </Stack>

              <TextField
                select
                label="Produto no estoque"
                size="small"
                value={item.productId || ""}
                disabled={item.excluded}
                onChange={(e) => updateItem(item.id, { productId: e.target.value || null })}
                fullWidth
              >
                <MenuItem value="">
                  <em>Selecione</em>
                </MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({formatQuantity(product.quantity, product.unit)})
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <TextField
                  label="Qtd"
                  type="number"
                  size="small"
                  value={item.quantity}
                  disabled={item.excluded}
                  inputProps={{ step: "any", min: 0 }}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  fullWidth
                />
                <TextField
                  select
                  label="Unidade"
                  size="small"
                  value={item.unit || "un"}
                  disabled={item.excluded}
                  onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                  fullWidth
                >
                  {Object.entries(UNIT_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              {item.warning === "exceeds_stock" && !item.excluded && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(item.allowZero)}
                      onChange={(e) => updateItem(item.id, { allowZero: e.target.checked })}
                    />
                  }
                  label="Zerar o produto se a quantidade passar do estoque"
                />
              )}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {activeCount} de {items.length} item(ns) serão baixados
      </Typography>

      <LoadingButton
        variant="contained"
        size="large"
        loading={confirming}
        disabled={activeCount === 0 || cancelling}
        onClick={handleConfirm}
      >
        Confirmar baixa
      </LoadingButton>

      <Button color="inherit" disabled={confirming || cancelling} onClick={handleCancel}>
        {cancelling ? "Cancelando…" : "Cancelar baixa"}
      </Button>
    </Stack>
  );
}
