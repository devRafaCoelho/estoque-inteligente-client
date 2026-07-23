import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UndoIcon from "@mui/icons-material/Undo";
import { intakeService } from "../../../services/intakeService";
import { listProductCategories } from "../../../services/productCategoryService";
import { listStockUnits } from "../../../services/stockUnitService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ProductCategorySelectField from "../../../components/form/ProductCategorySelectField";
import StockUnitSelectField from "../../../components/form/StockUnitSelectField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  draftItemCardSx,
  flexGrowSpacerSx,
  pageBackHeaderSx,
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  rawInputBoxSx,
} from "../../../styles/pageStyles";
import { INTAKE_PREVIEW_PAGE_COPY } from "./intakePreviewPageCopy";
import {
  INTAKE_PREVIEW_PAGE_CONFIG,
  confidenceLabel,
} from "./intakePreviewPageConfig";
import {
  actionsRowProps,
  chipRowProps,
  fieldRowProps,
  intakePreviewStackSpacing,
  itemInnerStackSpacing,
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
  const [intake, setIntake] = useState(null);
  const [items, setItems] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [stockUnits, setStockUnits] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([listProductCategories(), listStockUnits()])
      .then(([categories, units]) => {
        if (!active) return;
        setProductCategories(categories);
        setStockUnits(units);
      })
      .catch(() => {
        if (!active) return;
        setProductCategories([]);
        setStockUnits([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await intakeService.get(id);
      setIntake(data.intake);
      setItems(data.intake.items || []);
      setStoreName(data.intake.storeName || "");
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

  const activeCount = useMemo(
    () => items.filter((item) => !item.excluded).length,
    [items],
  );

  const updateItem = (itemId, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
  };

  const buildPayload = () => ({
    storeName: storeName.trim() || null,
    items: items.map((item, index) => ({
      id: item.id,
      productId: item.productId || null,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      category: item.category || INTAKE_PREVIEW_PAGE_CONFIG.defaultCategory,
      unitPrice:
        item.unitPrice === "" || item.unitPrice == null
          ? null
          : Number(item.unitPrice),
      excluded: Boolean(item.excluded),
      confidence: item.confidence ?? null,
      matchedExisting: Boolean(item.matchedExisting),
      sortOrder: index,
    })),
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const data = await intakeService.update(id, buildPayload());
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
      const data = await intakeService.confirm(id, buildPayload());
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
      await intakeService.cancel(id);
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
        <Box sx={rawInputBoxSx}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            {INTAKE_PREVIEW_PAGE_COPY.rawInputLabel}
          </Typography>
          <Typography variant="body2">{intake.rawInput}</Typography>
        </Box>
      )}

      <TextField
        label={INTAKE_PREVIEW_PAGE_COPY.storeLabel}
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        fullWidth
      />

      <Stack spacing={1.5}>
        {items.map((item) => {
          const conf = confidenceLabel(item.confidence);
          return (
            <Box key={item.id} sx={draftItemCardSx(item.excluded, "primary.light")}>
              <Stack spacing={itemInnerStackSpacing}>
                <Stack {...chipRowProps}>
                  {item.matchedExisting && (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={INTAKE_PREVIEW_PAGE_COPY.matchedExisting}
                    />
                  )}
                  {conf && (
                    <Chip size="small" color={conf.color} variant="outlined" label={conf.label} />
                  )}
                  <Box sx={flexGrowSpacerSx} />
                  <IconButton
                    size="small"
                    onClick={() => updateItem(item.id, { excluded: !item.excluded })}
                    aria-label={
                      item.excluded
                        ? INTAKE_PREVIEW_PAGE_COPY.reincluirAria
                        : INTAKE_PREVIEW_PAGE_COPY.excluirAria
                    }
                  >
                    {item.excluded ? <UndoIcon fontSize="small" /> : <DeleteOutlineIcon fontSize="small" />}
                  </IconButton>
                </Stack>

                <TextField
                  label={INTAKE_PREVIEW_PAGE_COPY.nameLabel}
                  size="small"
                  value={item.name}
                  disabled={item.excluded}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  fullWidth
                />

                <Stack {...fieldRowProps}>
                  <TextField
                    label={INTAKE_PREVIEW_PAGE_COPY.qtyLabel}
                    type="number"
                    size="small"
                    value={item.quantity}
                    disabled={item.excluded}
                    inputProps={{ step: "any", min: 0 }}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    fullWidth
                  />
                  <StockUnitSelectField
                    label={INTAKE_PREVIEW_PAGE_COPY.unitLabel}
                    value={item.unit || INTAKE_PREVIEW_PAGE_CONFIG.defaultUnit}
                    disabled={item.excluded}
                    onChange={(value) => updateItem(item.id, { unit: value })}
                    stockUnits={stockUnits}
                  />
                  <ProductCategorySelectField
                    label={INTAKE_PREVIEW_PAGE_COPY.categoryLabel}
                    value={item.category || INTAKE_PREVIEW_PAGE_CONFIG.defaultCategory}
                    disabled={item.excluded}
                    onChange={(value) => updateItem(item.id, { category: value })}
                    productCategories={productCategories}
                  />
                  <TextField
                    label={INTAKE_PREVIEW_PAGE_COPY.unitPriceLabel}
                    type="number"
                    size="small"
                    value={item.unitPrice ?? ""}
                    disabled={item.excluded}
                    inputProps={{ step: "0.01", min: 0 }}
                    onChange={(e) => updateItem(item.id, { unitPrice: e.target.value })}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {INTAKE_PREVIEW_PAGE_COPY.itemsSummary(activeCount, items.length)}
      </Typography>

      <Stack {...actionsRowProps}>
        <LoadingButton
          variant="contained"
          size="large"
          loading={confirming}
          disabled={activeCount === 0 || saving || cancelling}
          onClick={handleConfirm}
          fullWidth
        >
          {INTAKE_PREVIEW_PAGE_COPY.confirm}
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          size="large"
          loading={saving}
          disabled={confirming || cancelling}
          onClick={handleSaveDraft}
          fullWidth
        >
          {INTAKE_PREVIEW_PAGE_COPY.saveDraft}
        </LoadingButton>
      </Stack>

      <Button
        color="inherit"
        disabled={confirming || saving || cancelling}
        onClick={handleCancel}
      >
        {cancelling ? INTAKE_PREVIEW_PAGE_COPY.cancelling : INTAKE_PREVIEW_PAGE_COPY.cancel}
      </Button>
    </Stack>
  );
}
