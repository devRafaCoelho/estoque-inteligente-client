import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cancelIntake, confirmIntake, getIntakeById, updateIntake } from "../../../services/intakeService";
import { listProductCategories } from "../../../services/productCategoryService";
import { listStockUnits } from "../../../services/stockUnitService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import ReviewItemAccordion from "../../../components/common/ReviewItemAccordion/ReviewItemAccordion";
import {
  reviewItemFieldsSpacing,
  reviewItemQtyUnitRowProps,
} from "../../../components/common/ReviewItemAccordion/ReviewItemAccordion.styled";
import ProductCategorySelectField from "../../../components/form/ProductCategorySelectField";
import StockUnitSelectField from "../../../components/form/StockUnitSelectField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { buildIntakePreviewPayload } from "../../../utils/intake/intakeForm";
import { moneyToDisplay, parseMoneyInput } from "../../../utils/moneyInput";
import { formatQuantity } from "../../../utils/unitLabels";
import { isFilled, isPositiveNumber } from "../../../utils/formValidation";
import {
  pageBackHeaderSx,
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  rawInputBoxSx,
  rawInputOffsetSx,
} from "../../../styles/pageStyles";
import { INTAKE_PREVIEW_PAGE_COPY } from "./intakePreviewPageCopy";
import { INTAKE_PREVIEW_PAGE_CONFIG } from "./intakePreviewPageConfig";
import {
  actionsRowProps,
  intakePreviewStackSpacing,
  lockedStackSpacing,
} from "./IntakePreviewPage.styled";

export default function IntakePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [intake, setIntake] = useState(null);
  const [items, setItems] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [stockUnits, setStockUnits] = useState([]);

  useEffect(() => {
    let ativo = true;
    Promise.all([listProductCategories(), listStockUnits()])
      .then(([categories, units]) => {
        if (!ativo) return;
        setProductCategories(categories);
        setStockUnits(units);
      })
      .catch(() => {
        if (!ativo) return;
        setProductCategories([]);
        setStockUnits([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIntakeById(id);
      const nextItems = data.intake.items || [];
      setIntake(data.intake);
      setItems(nextItems);
      setStoreName(data.intake.storeName || "");
      setExpandedId(nextItems[0]?.id ?? null);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PREVIEW_PAGE_COPY.loadError);
      navigate(INTAKE_PREVIEW_PAGE_CONFIG.paths.entrada);
    } finally {
      setLoading(false);
    }
  }, [id, error, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = items.length;
  const itemsReady =
    activeCount > 0 &&
    items.every(
      (item) =>
        isFilled(item.name) &&
        isPositiveNumber(item.quantity) &&
        isFilled(item.unit) &&
        isFilled(item.category),
    );

  const updateItem = (itemId, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
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

  const getPayload = () =>
    buildIntakePreviewPayload({
      storeName,
      items,
      defaultCategory: INTAKE_PREVIEW_PAGE_CONFIG.defaultCategory,
    });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const data = await updateIntake(id, getPayload());
      setIntake(data.intake);
      setItems(data.intake.items || []);
      success(INTAKE_PREVIEW_PAGE_COPY.draftSaved);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PREVIEW_PAGE_COPY.saveDraftError);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (activeCount === 0) {
      error(INTAKE_PREVIEW_PAGE_COPY.selectItemError);
      return;
    }
    setConfirming(true);
    try {
      const data = await confirmIntake(id, getPayload());
      const count = data.products?.length || activeCount;
      success(
        data.purchase
          ? INTAKE_PREVIEW_PAGE_COPY.confirmSuccessWithPurchase(count)
          : INTAKE_PREVIEW_PAGE_COPY.confirmSuccess(count),
      );
      navigate(INTAKE_PREVIEW_PAGE_CONFIG.paths.produtos);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PREVIEW_PAGE_COPY.confirmError);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelIntake(id);
      setCancelConfirmOpen(false);
      success(INTAKE_PREVIEW_PAGE_COPY.cancelled);
      navigate(INTAKE_PREVIEW_PAGE_CONFIG.paths.entrada);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PREVIEW_PAGE_COPY.cancelError);
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

  if (!intake) return null;

  if (intake.status !== INTAKE_PREVIEW_PAGE_CONFIG.draftStatus) {
    return (
      <Stack spacing={lockedStackSpacing}>
        <Typography variant="h5">
          {intake.status === INTAKE_PREVIEW_PAGE_CONFIG.confirmedStatus
            ? INTAKE_PREVIEW_PAGE_COPY.statusConfirmed
            : INTAKE_PREVIEW_PAGE_COPY.statusCancelled}
        </Typography>
        <Typography color="text.secondary">{INTAKE_PREVIEW_PAGE_COPY.statusLocked}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(INTAKE_PREVIEW_PAGE_CONFIG.paths.produtos)}
        >
          {INTAKE_PREVIEW_PAGE_COPY.viewProducts}
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={intakePreviewStackSpacing}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => navigate(INTAKE_PREVIEW_PAGE_CONFIG.paths.entrada)}
          aria-label={INTAKE_PREVIEW_PAGE_COPY.backAria}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={pageBackHeaderSx}>
          <Typography variant="h5">{INTAKE_PREVIEW_PAGE_COPY.title}</Typography>
          <Typography variant="body2" sx={pageHeaderSubtitleSx} noWrap>
            {INTAKE_PREVIEW_PAGE_COPY.subtitle}
          </Typography>
        </Box>
      </Stack>

      {intake.rawInput && (
        <Box sx={rawInputOffsetSx}>
          <Box sx={rawInputBoxSx}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              {INTAKE_PREVIEW_PAGE_COPY.rawInputLabel}
            </Typography>
            <Typography variant="body2">{intake.rawInput}</Typography>
          </Box>
        </Box>
      )}

      <TextField
        label={INTAKE_PREVIEW_PAGE_COPY.storeLabel}
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        fullWidth
      />

      <Box>
        {items.length === 0 ? (
          <Typography color="text.secondary">{INTAKE_PREVIEW_PAGE_COPY.emptyItems}</Typography>
        ) : (
          items.map((item) => (
            <ReviewItemAccordion
              key={item.id}
              expanded={expandedId === item.id}
              onExpandedChange={(isExpanded) =>
                setExpandedId(isExpanded ? item.id : null)
              }
              title={item.name || INTAKE_PREVIEW_PAGE_COPY.nameLabel}
              subtitle={formatQuantity(
                item.quantity,
                item.unit || INTAKE_PREVIEW_PAGE_CONFIG.defaultUnit,
                stockUnits,
              )}
              chips={
                item.matchedExisting ? (
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    label={INTAKE_PREVIEW_PAGE_COPY.matchedExisting}
                  />
                ) : null
              }
              onDelete={() => requestRemoveItem(item)}
              deleteAriaLabel={INTAKE_PREVIEW_PAGE_COPY.excluirAria}
              expandAriaLabel={INTAKE_PREVIEW_PAGE_COPY.expandItemAria}
            >
              <Stack spacing={reviewItemFieldsSpacing}>
                <TextField
                  label={INTAKE_PREVIEW_PAGE_COPY.nameLabel}
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  fullWidth
                />

                <Stack {...reviewItemQtyUnitRowProps}>
                  <TextField
                    label={INTAKE_PREVIEW_PAGE_COPY.qtyLabel}
                    type="number"
                    value={item.quantity}
                    inputProps={{ step: "any", min: 0 }}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    sx={{ flex: 1, minWidth: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <StockUnitSelectField
                      label={INTAKE_PREVIEW_PAGE_COPY.unitLabel}
                      value={item.unit || INTAKE_PREVIEW_PAGE_CONFIG.defaultUnit}
                      onChange={(value) => updateItem(item.id, { unit: value })}
                      stockUnits={stockUnits}
                    />
                  </Box>
                </Stack>

                <ProductCategorySelectField
                  label={INTAKE_PREVIEW_PAGE_COPY.categoryLabel}
                  value={item.category || INTAKE_PREVIEW_PAGE_CONFIG.defaultCategory}
                  onChange={(value) => updateItem(item.id, { category: value })}
                  productCategories={productCategories}
                />

                <TextField
                  label={INTAKE_PREVIEW_PAGE_COPY.unitPriceLabel}
                  value={moneyToDisplay(item.unitPrice)}
                  onChange={(e) =>
                    updateItem(item.id, { unitPrice: parseMoneyInput(e.target.value) })
                  }
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                      inputMode: "numeric",
                    },
                  }}
                />
              </Stack>
            </ReviewItemAccordion>
          ))
        )}
      </Box>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {INTAKE_PREVIEW_PAGE_COPY.itemsSummary(activeCount)}
      </Typography>

      <Stack {...actionsRowProps}>
        <LoadingButton
          variant="contained"
          size="large"
          loading={confirming}
          disabled={!itemsReady || saving || cancelling}
          onClick={handleConfirm}
          fullWidth
        >
          {INTAKE_PREVIEW_PAGE_COPY.confirm}
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          size="large"
          loading={saving}
          disabled={!itemsReady || confirming || cancelling}
          onClick={handleSaveDraft}
          fullWidth
        >
          {INTAKE_PREVIEW_PAGE_COPY.saveDraft}
        </LoadingButton>
      </Stack>

      <Button
        color="inherit"
        disabled={confirming || saving || cancelling}
        onClick={() => setCancelConfirmOpen(true)}
      >
        {INTAKE_PREVIEW_PAGE_COPY.cancel}
      </Button>

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        onClose={cancelRemoveItem}
        title={INTAKE_PREVIEW_PAGE_COPY.removeConfirmTitle}
        description={
          itemToRemove
            ? INTAKE_PREVIEW_PAGE_COPY.removeConfirmDescription(itemToRemove.name)
            : ""
        }
        onConfirm={confirmRemoveItem}
        confirmLabel={INTAKE_PREVIEW_PAGE_COPY.removeConfirmLabel}
        cancelLabel={INTAKE_PREVIEW_PAGE_COPY.removeCancelLabel}
      />

      <ConfirmDialog
        open={cancelConfirmOpen}
        onClose={() => {
          if (cancelling) return;
          setCancelConfirmOpen(false);
        }}
        title={INTAKE_PREVIEW_PAGE_COPY.cancelConfirmTitle}
        description={INTAKE_PREVIEW_PAGE_COPY.cancelConfirmDescription}
        onConfirm={handleCancel}
        confirmLoading={cancelling}
        confirmLabel={INTAKE_PREVIEW_PAGE_COPY.cancelConfirmLabel}
        cancelLabel={INTAKE_PREVIEW_PAGE_COPY.cancelDismissLabel}
      />
    </Stack>
  );
}
