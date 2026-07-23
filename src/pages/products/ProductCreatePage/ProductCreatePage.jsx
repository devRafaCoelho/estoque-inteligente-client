import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ProductCategorySelectField from "../../../components/form/ProductCategorySelectField";
import StockUnitSelectField from "../../../components/form/StockUnitSelectField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { productSchema } from "../../../schemas";
import { ApiError } from "../../../services/apiClient";
import { productService } from "../../../services/productService";
import { categoryLabel } from "../../../utils/categoryLabels";
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
  formSectionSx,
  quantityRowSpacing,
  stageItemActionsSx,
  stageItemSx,
  stageListSpacing,
  unitSelectSx,
} from "./ProductCreatePage.styled";

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const nameInputRef = useRef(null);

  const [staged, setStaged] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: { ...PRODUCT_CREATE_CONFIG.defaultValues },
  });

  const { ref: nameRegisterRef, ...nameRegister } = register("name");

  const resetForm = () => {
    reset({ ...PRODUCT_CREATE_CONFIG.defaultValues });
    setEditingId(null);
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const addToStage = (values) => {
    const nameKey = normalizeName(values.name);
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
    resetForm();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setValue("name", item.name);
    setValue("category", item.category);
    setValue("quantity", item.quantity);
    setValue("unit", item.unit);
    setValue("minQuantity", item.minQuantity);
    setValue("notes", item.notes || "");
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const removeItem = (id) => {
    setStaged((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const saveAll = async () => {
    if (!staged.length) return;
    setSaving(true);
    try {
      const products = staged.map(({ name, category, quantity, unit, minQuantity, notes }) => ({
        name,
        category,
        quantity,
        unit,
        minQuantity,
        notes,
      }));
      const result = await productService.createBatch(products);

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

      <Box>
        <Typography sx={pageSectionTitleSx}>
          {PRODUCT_CREATE_COPY.stageTitle}
          {staged.length ? ` (${staged.length})` : ""}
        </Typography>
        {staged.length === 0 ? (
          <Typography color="text.secondary">{PRODUCT_CREATE_COPY.stageEmpty}</Typography>
        ) : (
          <Stack spacing={stageListSpacing}>
            {staged.map((item) => (
              <Box key={item.id} sx={stageItemSx}>
                <Typography fontWeight={700}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {categoryLabel(item.category)} · {item.quantity} {unitLabel(item.unit)} · mín.{" "}
                  {item.minQuantity}
                </Typography>
                <Stack direction="row" spacing={1} sx={stageItemActionsSx}>
                  <Button
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => startEdit(item)}
                  >
                    {PRODUCT_CREATE_COPY.editItem}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => removeItem(item.id)}
                  >
                    {PRODUCT_CREATE_COPY.removeItem}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box
        component="form"
        key={editingId || "new-item"}
        sx={formSectionSx}
        onSubmit={handleSubmit(addToStage)}
      >
        <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
          {editingId ? PRODUCT_CREATE_COPY.updateStage : PRODUCT_CREATE_COPY.addToStage}
        </Typography>

        <Stack spacing={formStackSpacing}>
          <TextField
            label={PRODUCT_CREATE_COPY.nameLabel}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            inputRef={(el) => {
              nameInputRef.current = el;
              nameRegisterRef(el);
            }}
            {...nameRegister}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <ProductCategorySelectField
                label={PRODUCT_CREATE_COPY.categoryLabel}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(errors.category)}
                helperText={errors.category?.message}
                required
              />
            )}
          />
          <Stack direction="row" spacing={quantityRowSpacing} alignItems="flex-start">
            <TextField
              label={PRODUCT_CREATE_COPY.quantityLabel}
              type="number"
              fullWidth
              inputProps={PRODUCT_CREATE_CONFIG.quantityInputProps}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              {...register("quantity")}
            />
            <Box sx={unitSelectSx}>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <StockUnitSelectField
                    label={PRODUCT_CREATE_COPY.unitLabel}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={Boolean(errors.unit)}
                    helperText={errors.unit?.message}
                    required
                  />
                )}
              />
            </Box>
          </Stack>
          <TextField
            label={PRODUCT_CREATE_COPY.minQuantityLabel}
            type="number"
            inputProps={PRODUCT_CREATE_CONFIG.minQuantityInputProps}
            error={Boolean(errors.minQuantity)}
            helperText={errors.minQuantity?.message}
            {...register("minQuantity")}
          />
          <TextField
            label={PRODUCT_CREATE_COPY.notesLabel}
            multiline
            minRows={2}
            {...register("notes")}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button type="submit" variant="outlined" size="large" fullWidth>
              {editingId ? PRODUCT_CREATE_COPY.updateStage : PRODUCT_CREATE_COPY.addToStage}
            </Button>
            {editingId ? (
              <Button type="button" variant="text" size="large" onClick={resetForm}>
                {PRODUCT_CREATE_COPY.cancelEdit}
              </Button>
            ) : null}
          </Stack>
        </Stack>
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
    </Stack>
  );
}
