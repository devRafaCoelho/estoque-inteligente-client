import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { cancelStockOut, confirmStockOut, getStockOutById } from "../../../services/stockOutService";
import { listProducts } from "../../../services/productService";
import { listStockUnits } from "../../../services/stockUnitService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import ReviewItemAccordion from "../../../components/common/ReviewItemAccordion/ReviewItemAccordion";
import {
  reviewItemFieldsSpacing,
  reviewItemQtyUnitRowProps,
} from "../../../components/common/ReviewItemAccordion/ReviewItemAccordion.styled";
import StockUnitSelectField from "../../../components/form/StockUnitSelectField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { formatQuantity } from "../../../utils/unitLabels";
import { buildStockOutPreviewPayload } from "../../../utils/stockOut/stockOutForm";
import {
  pageBackHeaderSx,
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  rawInputBoxSx,
  rawInputOffsetSx,
} from "../../../styles/pageStyles";
import { STOCK_OUT_PREVIEW_PAGE_COPY } from "./stockOutPreviewPageCopy";
import { STOCK_OUT_PREVIEW_PAGE_CONFIG } from "./stockOutPreviewPageConfig";
import {
  allowZeroLabelSx,
  lockedStackSpacing,
  stockOutPreviewStackSpacing,
} from "./StockOutPreviewPage.styled";

function onlyMatchedItems(items = []) {
  return items.filter((item) => item.productId);
}

export default function StockOutPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
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
      const nextItems = onlyMatchedItems(draft.stockOut.items || []);
      setStockOut(draft.stockOut);
      setItems(nextItems);
      setProducts(catalog.products || []);
      setExpandedId(nextItems[0]?.id ?? null);
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

  const activeCount = items.length;

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

  const requestRemoveItem = (item) => {
    setItemToRemove(item);
  };

  const cancelRemoveItem = () => {
    setItemToRemove(null);
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) return;
    const removedId = itemToRemove.id;
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== removedId);
      setExpandedId((current) => {
        if (current !== removedId) return current;
        return next[0]?.id ?? null;
      });
      return next;
    });
    setItemToRemove(null);
  };

  const getPayload = () => buildStockOutPreviewPayload({ items });

  const handleConfirm = async () => {
    if (activeCount === 0) {
      error(STOCK_OUT_PREVIEW_PAGE_COPY.selectItemError);
      return;
    }
    const unresolved = items.filter((item) => !item.productId);
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
      setCancelConfirmOpen(false);
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
        <Box sx={pageBackHeaderSx}>
          <Typography variant="h5">{STOCK_OUT_PREVIEW_PAGE_COPY.title}</Typography>
          <Typography variant="body2" sx={pageHeaderSubtitleSx} noWrap>
            {STOCK_OUT_PREVIEW_PAGE_COPY.subtitle}
          </Typography>
        </Box>
      </Stack>

      {stockOut.rawInput && (
        <Box sx={rawInputOffsetSx}>
          <Box sx={rawInputBoxSx}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              {STOCK_OUT_PREVIEW_PAGE_COPY.rawInputLabel}
            </Typography>
            <Typography variant="body2">{stockOut.rawInput}</Typography>
          </Box>
        </Box>
      )}

      <Box>
        {items.length === 0 ? (
          <Typography color="text.secondary">{STOCK_OUT_PREVIEW_PAGE_COPY.emptyItems}</Typography>
        ) : (
          items.map((item) => (
            <ReviewItemAccordion
              key={item.id}
              expanded={expandedId === item.id}
              onExpandedChange={(isExpanded) =>
                setExpandedId(isExpanded ? item.id : null)
              }
              title={item.name || STOCK_OUT_PREVIEW_PAGE_COPY.productLabel}
              subtitle={formatQuantity(
                item.quantity,
                item.unit || STOCK_OUT_PREVIEW_PAGE_CONFIG.defaultUnit,
                stockUnits,
              )}
              chips={
                item.availableQty != null ? (
                  <Chip
                    size="small"
                    color={
                      item.warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock
                        ? "warning"
                        : "default"
                    }
                    variant="outlined"
                    label={STOCK_OUT_PREVIEW_PAGE_COPY.stockChip(
                      formatQuantity(item.availableQty, item.unit, stockUnits),
                    )}
                  />
                ) : null
              }
              onDelete={() => requestRemoveItem(item)}
              deleteAriaLabel={STOCK_OUT_PREVIEW_PAGE_COPY.excluirAria}
              expandAriaLabel={STOCK_OUT_PREVIEW_PAGE_COPY.expandItemAria}
            >
              <Stack spacing={reviewItemFieldsSpacing}>
                <TextField
                  select
                  label={STOCK_OUT_PREVIEW_PAGE_COPY.productLabel}
                  value={item.productId || ""}
                  onChange={(e) =>
                    updateItem(item.id, { productId: e.target.value || null })
                  }
                  fullWidth
                >
                  <MenuItem value="">
                    <em>{STOCK_OUT_PREVIEW_PAGE_COPY.selectProduct}</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack {...reviewItemQtyUnitRowProps}>
                  <TextField
                    label={STOCK_OUT_PREVIEW_PAGE_COPY.qtyLabel}
                    type="number"
                    value={item.quantity}
                    inputProps={{ step: "any", min: 0 }}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    sx={{ flex: 1, minWidth: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <StockUnitSelectField
                      label={STOCK_OUT_PREVIEW_PAGE_COPY.unitLabel}
                      value={item.unit || STOCK_OUT_PREVIEW_PAGE_CONFIG.defaultUnit}
                      onChange={(value) => updateItem(item.id, { unit: value })}
                      stockUnits={stockUnits}
                    />
                  </Box>
                </Stack>

                {item.warning === STOCK_OUT_PREVIEW_PAGE_CONFIG.warningExceedsStock && (
                  <FormControlLabel
                    sx={allowZeroLabelSx}
                    control={
                      <Checkbox
                        size="small"
                        checked={Boolean(item.allowZero)}
                        onChange={(e) =>
                          updateItem(item.id, { allowZero: e.target.checked })
                        }
                      />
                    }
                    label={STOCK_OUT_PREVIEW_PAGE_COPY.allowZeroLabel}
                  />
                )}
              </Stack>
            </ReviewItemAccordion>
          ))
        )}
      </Box>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {STOCK_OUT_PREVIEW_PAGE_COPY.itemsSummary(activeCount)}
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

      <Button
        color="inherit"
        disabled={confirming || cancelling}
        onClick={() => setCancelConfirmOpen(true)}
      >
        {STOCK_OUT_PREVIEW_PAGE_COPY.cancel}
      </Button>

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        onClose={cancelRemoveItem}
        title={STOCK_OUT_PREVIEW_PAGE_COPY.removeConfirmTitle}
        description={
          itemToRemove
            ? STOCK_OUT_PREVIEW_PAGE_COPY.removeConfirmDescription(itemToRemove.name)
            : ""
        }
        onConfirm={confirmRemoveItem}
        confirmLabel={STOCK_OUT_PREVIEW_PAGE_COPY.removeConfirmLabel}
        cancelLabel={STOCK_OUT_PREVIEW_PAGE_COPY.removeCancelLabel}
      />

      <ConfirmDialog
        open={cancelConfirmOpen}
        onClose={() => {
          if (cancelling) return;
          setCancelConfirmOpen(false);
        }}
        title={STOCK_OUT_PREVIEW_PAGE_COPY.cancelConfirmTitle}
        description={STOCK_OUT_PREVIEW_PAGE_COPY.cancelConfirmDescription}
        onConfirm={handleCancel}
        confirmLoading={cancelling}
        confirmLabel={STOCK_OUT_PREVIEW_PAGE_COPY.cancelConfirmLabel}
        cancelLabel={STOCK_OUT_PREVIEW_PAGE_COPY.cancelDismissLabel}
      />
    </Stack>
  );
}
