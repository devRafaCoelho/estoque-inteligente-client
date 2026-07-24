import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ProductFormDialog from "../../../components/products/ProductFormDialog/ProductFormDialog";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { createProductsBatch } from "../../../services/productService";
import { categoryLabel } from "../../../utils/categoryLabels";
import { buildCreateProductsBatchPayload } from "../../../utils/products/productForm";
import { unitLabel } from "../../../utils/unitLabels";
import { formStackSpacing } from "../../../styles/formStyles";
import {
  pageHeaderSubtitleSx,
  pageSectionTitleSx,
  pageToolbarRowSx,
} from "../../../styles/pageStyles";
import { PRODUCT_CREATE_CONFIG } from "./productCreateConfig";
import { PRODUCT_CREATE_COPY } from "./productCreateCopy";
import {
  headerActionsSx,
  stageItemActionsSx,
  stageItemContentSx,
  stageItemSx,
  stageListSpacing,
} from "./ProductCreatePage.styled";

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [staged, setStaged] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(editingItem);
  const formInitialValues = useMemo(() => {
    if (!editingItem) {
      return { ...PRODUCT_CREATE_CONFIG.defaultValues };
    }
    return {
      name: editingItem.name,
      category: editingItem.category,
      quantity: editingItem.quantity,
      unit: editingItem.unit,
      minQuantity: editingItem.minQuantity,
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
      error(PRODUCT_CREATE_COPY.duplicateInStage);
      return;
    }

    const payload = {
      name: values.name.trim(),
      category: values.category,
      quantity: Number(values.quantity),
      unit: values.unit,
      minQuantity: Number(values.minQuantity),
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
        success(PRODUCT_CREATE_COPY.successAll(result.createdCount));
        navigate(PRODUCT_CREATE_CONFIG.paths.list);
        return;
      }

      if (result.createdCount > 0) {
        success(
          PRODUCT_CREATE_COPY.partialSuccess(result.createdCount, result.errorCount),
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
        error(PRODUCT_CREATE_COPY.error);
      }
    } catch (err) {
      error(err instanceof ApiError ? err.message : PRODUCT_CREATE_COPY.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={formStackSpacing}>
      <Stack direction="row" alignItems="center" spacing={1} sx={pageToolbarRowSx}>
        <IconButton onClick={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{PRODUCT_CREATE_COPY.title}</Typography>
          <Typography sx={pageHeaderSubtitleSx}>{PRODUCT_CREATE_COPY.subtitle}</Typography>
        </Box>
      </Stack>

      <Box sx={headerActionsSx}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
          fullWidth
          sx={{ width: { sm: "auto" } }}
        >
          {PRODUCT_CREATE_COPY.addProduct}
        </Button>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>
          {PRODUCT_CREATE_COPY.stageTitle}
          {staged.length ? ` (${staged.length})` : ""}
        </Typography>
        {staged.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Inventory2OutlinedIcon}
            title={PRODUCT_CREATE_COPY.stageEmptyTitle}
            description={PRODUCT_CREATE_COPY.stageEmptyDescription}
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
                    {categoryLabel(item.category)} · {item.quantity} {unitLabel(item.unit)} · mín.{" "}
                    {item.minQuantity}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.25} sx={stageItemActionsSx}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => openEditForm(item)}
                    aria-label={PRODUCT_CREATE_COPY.editItem}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setItemToRemove(item)}
                    aria-label={PRODUCT_CREATE_COPY.removeItem}
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
        variant="contained"
        size="large"
        loading={saving}
        disabled={!staged.length}
        onClick={saveAll}
      >
        {PRODUCT_CREATE_COPY.saveAll(staged.length || 0)}
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
        title={PRODUCT_CREATE_COPY.deleteConfirmTitle}
        description={
          itemToRemove
            ? PRODUCT_CREATE_COPY.deleteConfirmDescription(itemToRemove.name)
            : ""
        }
        onConfirm={confirmRemoveItem}
        confirmLabel={PRODUCT_CREATE_COPY.deleteConfirmLabel}
        cancelLabel={PRODUCT_CREATE_COPY.deleteCancelLabel}
      />
    </Stack>
  );
}
