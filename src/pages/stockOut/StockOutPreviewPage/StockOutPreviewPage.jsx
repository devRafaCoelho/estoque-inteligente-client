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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UndoIcon from "@mui/icons-material/Undo";
import { cancelStockOut, confirmStockOut, getStockOutById } from "../../../services/stockOutService";
import { listProducts } from "../../../services/productService";
import { listStockUnits } from "../../../services/stockUnitService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import StockUnitSelectField from "../../../components/form/StockUnitSelectField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { formatQuantity } from "../../../utils/unitLabels";
import { buildStockOutPreviewPayload } from "../../../utils/stockOut/stockOutForm";
import {
  draftItemCardSx,
  flexGrowSpacerSx,
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { STOCK_OUT_PREVIEW_PAGE_COPY } from "./stockOutPreviewPageCopy";
import {
  STOCK_OUT_PREVIEW_PAGE_CONFIG,
  warningLabel,
} from "./stockOutPreviewPageConfig";
import {
  chipRowProps,
  fieldRowProps,
  itemInnerStackSpacing,
  lockedStackSpacing,
  stockOutPreviewStackSpacing,
} from "./StockOutPreviewPage.styled";

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
  const [stockUnits, setStockUnits] = useState([]);

  useEffect(() => {
    let ativo = true;
    listStockUnits()
      .then((units) => {
        if (ativo) setStockUnits(units);
      })
      .catch(() => {
        if (ativo) setStockUnits([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [draft, catalog] = await Promise.all([
        getStockOutById(id),
        listProducts({ active: true }),
      ]);
      setStockOut(draft.stockOut);
      setItems(draft.stockOut.items || []);
      setProducts(catalog.products || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PREVIEW_PAGE_COPY.loadError);
      navigate(STOCK_OUT_PREVIEW_PAGE_CONFIG.paths.baixa);
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
          next.warning = STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock;
        } else if (!next.productId) {
          next.warning = STOCK_OUT_PREVIEW_PAGE_CONFIG.warningProductNotFound;
        } else {
          next.warning = null;
        }
        return next;
      }),
    );
  };

  const getPayload = () => buildStockOutPreviewPayload({ items });

  const handleConfirm = async () => {
    if (activeCount === 0) {
      error(STOCK_OUT_PREVIEW_PAGE_COPY.selectItemError);
      return;
    }
    const unresolved = items.filter((item) => !item.excluded && !item.productId);
    if (unresolved.length) {
      error(STOCK_OUT_PREVIEW_PAGE_COPY.linkProductError);
      return;
    }
    setConfirming(true);
    try {
      const data = await confirmStockOut(id, getPayload());
      success(
        STOCK_OUT_PREVIEW_PAGE_COPY.confirmSuccess(data.products?.length || activeCount),
      );
      navigate(STOCK_OUT_PREVIEW_PAGE_CONFIG.paths.produtos);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PREVIEW_PAGE_COPY.confirmError);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelStockOut(id);
      success(STOCK_OUT_PREVIEW_PAGE_COPY.cancelled);
      navigate(STOCK_OUT_PREVIEW_PAGE_CONFIG.paths.baixa);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PREVIEW_PAGE_COPY.cancelError);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stockOut) return null;

  if (stockOut.status !== STOCK_OUT_PREVIEW_PAGE_CONFIG.draftStatus) {
    return (
      <Stack spacing={lockedStackSpacing}>
        <Typography variant="h5">
          {stockOut.status === STOCK_OUT_PREVIEW_PAGE_CONFIG.confirmedStatus
            ? STOCK_OUT_PREVIEW_PAGE_COPY.statusConfirmed
            : STOCK_OUT_PREVIEW_PAGE_COPY.statusCancelled}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(STOCK_OUT_PREVIEW_PAGE_CONFIG.paths.produtos)}
        >
          {STOCK_OUT_PREVIEW_PAGE_COPY.viewProducts}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={stockOutPreviewStackSpacing}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => navigate(STOCK_OUT_PREVIEW_PAGE_CONFIG.paths.baixa)}
          aria-label={STOCK_OUT_PREVIEW_PAGE_COPY.backAria}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{STOCK_OUT_PREVIEW_PAGE_COPY.title}</Typography>
          <Typography variant="body2" sx={pageHeaderSubtitleSx}>
            {STOCK_OUT_PREVIEW_PAGE_COPY.subtitle}
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
          <Box key={item.id} sx={draftItemCardSx(item.excluded, "warning.light")}>
            <Stack spacing={itemInnerStackSpacing}>
              <Stack {...chipRowProps}>
                {item.warning && (
                  <Chip
                    size="small"
                    color={
                      item.warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock
                        ? "warning"
                        : "error"
                    }
                    label={warningLabel(item.warning)}
                  />
                )}
                {item.availableQty != null && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={STOCK_OUT_PREVIEW_PAGE_COPY.stockChip(
                      formatQuantity(item.availableQty, item.unit),
                    )}
                  />
                )}
                <Box sx={flexGrowSpacerSx} />
                <IconButton
                  size="small"
                  onClick={() => updateItem(item.id, { excluded: !item.excluded })}
                >
                  {item.excluded ? <UndoIcon fontSize="small" /> : <DeleteOutlineIcon fontSize="small" />}
                </IconButton>
              </Stack>

              <TextField
                select
                label={STOCK_OUT_PREVIEW_PAGE_COPY.productLabel}
                size="small"
                value={item.productId || ""}
                disabled={item.excluded}
                onChange={(e) => updateItem(item.id, { productId: e.target.value || null })}
                fullWidth
              >
                <MenuItem value="">
                  <em>{STOCK_OUT_PREVIEW_PAGE_COPY.selectProduct}</em>
                </MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({formatQuantity(product.quantity, product.unit)})
                  </MenuItem>
                ))}
              </TextField>

              <Stack {...fieldRowProps}>
                <TextField
                  label={STOCK_OUT_PREVIEW_PAGE_COPY.qtyLabel}
                  type="number"
                  size="small"
                  value={item.quantity}
                  disabled={item.excluded}
                  inputProps={{ step: "any", min: 0 }}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  fullWidth
                />
                <StockUnitSelectField
                  label={STOCK_OUT_PREVIEW_PAGE_COPY.unitLabel}
                  value={item.unit || STOCK_OUT_PREVIEW_PAGE_CONFIG.defaultUnit}
                  disabled={item.excluded}
                  onChange={(value) => updateItem(item.id, { unit: value })}
                  stockUnits={stockUnits}
                />
              </Stack>

              {item.warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock &&
                !item.excluded && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(item.allowZero)}
                        onChange={(e) => updateItem(item.id, { allowZero: e.target.checked })}
                      />
                    }
                    label={STOCK_OUT_PREVIEW_PAGE_COPY.allowZeroLabel}
                  />
                )}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {STOCK_OUT_PREVIEW_PAGE_COPY.itemsSummary(activeCount, items.length)}
      </Typography>

      <LoadingButton
        variant="contained"
        size="large"
        loading={confirming}
        disabled={activeCount === 0 || cancelling}
        onClick={handleConfirm}
      >
        {STOCK_OUT_PREVIEW_PAGE_COPY.confirm}
      </LoadingButton>

      <Button color="inherit" disabled={confirming || cancelling} onClick={handleCancel}>
        {cancelling
          ? STOCK_OUT_PREVIEW_PAGE_COPY.cancelling
          : STOCK_OUT_PREVIEW_PAGE_COPY.cancel}
      </Button>
    </Stack>
  );
}
