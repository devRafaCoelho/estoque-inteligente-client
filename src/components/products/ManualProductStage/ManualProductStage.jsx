import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ConfirmDialog from "../../common/ConfirmDialog/ConfirmDialog";
import EmptyState from "../../common/EmptyState/EmptyState";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import ProductFormDialog from "../ProductFormDialog/ProductFormDialog";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { createProductsBatch } from "../../../services/productService";
import { categoryLabel } from "../../../utils/categoryLabels";
import { buildCreateProductsBatchPayload } from "../../../utils/products/productForm";
import { unitLabel } from "../../../utils/unitLabels";
import { pageSectionTitleSx } from "../../../styles/pageStyles";
import { MANUAL_PRODUCT_STAGE_CONFIG } from "./manualProductStageConfig";
import { MANUAL_PRODUCT_STAGE_COPY } from "./manualProductStageCopy";
import {
  addProductButtonSx,
  stageItemActionsSx,
  stageItemContentSx,
  stageItemSx,
  stageListSpacing,
} from "./ManualProductStage.styled";

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

/**
 * Fluxo de cadastro manual (lista staged + dialog).
 * Usado em `/produtos/novo` e na aba Manual de `/entrada`.
 *
 * @param {{ onSaved?: () => void, disabled?: boolean, showIntro?: boolean }} props
 */
export default function ManualProductStage({
  onSaved,
  disabled = false,
  showIntro = true,
}) {
  const { success, error } = useAppSnackbar();
  const [staged, setStaged] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(editingItem);
  const formInitialValues = useMemo(() => {
    if (!editingItem) {
      return { ...MANUAL_PRODUCT_STAGE_CONFIG.defaultValues };
    }
    return {
      name: editingItem.name,
      category: editingItem.category,
      quantity: editingItem.quantity,
      unit: editingItem.unit,
      minQuantity: editingItem.minQuantity,
      repurchaseDays: editingItem.repurchaseDays ?? "",
      notes: editingItem.notes || "",
    };
  }, [editingItem]);

  const openCreateForm = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (values) => {
    const nameKey = normalizeName(values.name);
    const editingId = editingItem?.id ?? null;
    const duplicate = staged.some(
      (item) => item.id !== editingId && normalizeName(item.name) === nameKey,
    );
    if (duplicate) {
      error(MANUAL_PRODUCT_STAGE_COPY.duplicateInStage);
      return;
    }

    const payload = {
      name: values.name.trim(),
      category: values.category,
      quantity: Number(values.quantity),
      unit: values.unit,
      minQuantity: Number(values.minQuantity),
      repurchaseDays:
        values.repurchaseDays === "" || values.repurchaseDays == null
          ? null
          : Number(values.repurchaseDays),
      notes: values.notes || "",
    };

    if (editingId) {
      setStaged((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)),
      );
    } else {
      setStaged((prev) => [...prev, { id: crypto.randomUUID(), ...payload }]);
    }
    closeForm();
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) return;
    const { id } = itemToRemove;
    setStaged((prev) => prev.filter((item) => item.id !== id));
    if (editingItem?.id === id) closeForm();
    setItemToRemove(null);
  };

  const saveAll = async () => {
    if (!staged.length) return;
    setSaving(true);
    try {
      const result = await createProductsBatch(
        buildCreateProductsBatchPayload(staged),
      );

      if (result.createdCount > 0 && result.errorCount === 0) {
        success(MANUAL_PRODUCT_STAGE_COPY.successAll(result.createdCount));
        setStaged([]);
        onSaved?.();
        return;
      }

      if (result.createdCount > 0) {
        success(
          MANUAL_PRODUCT_STAGE_COPY.partialSuccess(
            result.createdCount,
            result.errorCount,
          ),
        );
        const failedIndexes = new Set((result.errors || []).map((e) => e.index));
        setStaged((prev) => prev.filter((_, index) => failedIndexes.has(index)));
        (result.errors || []).forEach((entry) => {
          error(`${entry.name}: ${entry.error}`);
        });
        return;
      }

      (result.errors || []).forEach((entry) => {
        error(`${entry.name}: ${entry.error}`);
      });
      if (!(result.errors || []).length) {
        error(MANUAL_PRODUCT_STAGE_COPY.error);
      }
    } catch (err) {
      error(err instanceof ApiError ? err.message : MANUAL_PRODUCT_STAGE_COPY.error);
    } finally {
      setSaving(false);
    }
  };

  const busy = Boolean(disabled || saving);

  return (
    <Stack spacing={2}>
      {showIntro && (
        <Box>
          <Typography fontWeight={700}>{MANUAL_PRODUCT_STAGE_COPY.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {MANUAL_PRODUCT_STAGE_COPY.hint}
          </Typography>
        </Box>
      )}

      <Button
        type="button"
        variant="outlined"
        size="large"
        startIcon={<AddIcon />}
        onClick={openCreateForm}
        disabled={busy}
        sx={addProductButtonSx}
      >
        {MANUAL_PRODUCT_STAGE_COPY.addProduct}
      </Button>

      <Box>
        <Typography sx={pageSectionTitleSx}>
          {MANUAL_PRODUCT_STAGE_COPY.stageTitle}
          {staged.length ? ` (${staged.length})` : ""}
        </Typography>
        {staged.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Inventory2OutlinedIcon}
            title={MANUAL_PRODUCT_STAGE_COPY.stageEmptyTitle}
            description={MANUAL_PRODUCT_STAGE_COPY.stageEmptyDescription}
          />
        ) : (
          <Stack spacing={stageListSpacing}>
            {staged.map((item) => (
              <Box key={item.id} sx={stageItemSx}>
                <Box sx={stageItemContentSx}>
                  <Typography fontWeight={700} noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {categoryLabel(item.category)} · {item.quantity}{" "}
                    {unitLabel(item.unit)} · mín. {item.minQuantity}
                    {item.repurchaseDays
                      ? ` · recompra ${item.repurchaseDays}d`
                      : ""}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.25} sx={stageItemActionsSx}>
                  <IconButton
                    size="small"
                    color="primary"
                    disabled={busy}
                    onClick={() => openEditForm(item)}
                    aria-label={MANUAL_PRODUCT_STAGE_COPY.editItem}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={busy}
                    onClick={() => setItemToRemove(item)}
                    aria-label={MANUAL_PRODUCT_STAGE_COPY.removeItem}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <LoadingButton
        type="button"
        variant="contained"
        size="large"
        loading={saving}
        disabled={!staged.length || disabled}
        onClick={saveAll}
      >
        {MANUAL_PRODUCT_STAGE_COPY.saveAll(staged.length || 0)}
      </LoadingButton>

      <ProductFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialValues={formInitialValues}
        isEditing={isEditing}
      />

      <ConfirmDialog
        open={Boolean(itemToRemove)}
        onClose={() => setItemToRemove(null)}
        title={MANUAL_PRODUCT_STAGE_COPY.deleteConfirmTitle}
        description={
          itemToRemove
            ? MANUAL_PRODUCT_STAGE_COPY.deleteConfirmDescription(itemToRemove.name)
            : ""
        }
        onConfirm={confirmRemoveItem}
        confirmLabel={MANUAL_PRODUCT_STAGE_COPY.deleteConfirmLabel}
        cancelLabel={MANUAL_PRODUCT_STAGE_COPY.deleteCancelLabel}
      />
    </Stack>
  );
}
