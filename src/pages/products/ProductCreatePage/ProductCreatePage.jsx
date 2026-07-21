import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../../schemas";
import { CATEGORY_LABELS, UNIT_LABELS } from "../../../config/constants";
import { productService } from "../../../services/productService";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { pageToolbarRowSx } from "../../../styles/pageStyles";
import { formStackSpacing } from "../../../styles/formStyles";
import { PRODUCT_CREATE_COPY } from "./productCreateCopy";
import { PRODUCT_CREATE_CONFIG } from "./productCreateConfig";
import { quantityRowSpacing, unitSelectSx } from "./ProductCreatePage.styled";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: { ...PRODUCT_CREATE_CONFIG.defaultValues },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await productService.create({
        ...values,
        quantity: Number(values.quantity),
        minQuantity: Number(values.minQuantity),
      });
      success(PRODUCT_CREATE_COPY.success);
      navigate(PRODUCT_CREATE_CONFIG.paths.detail(data.product.id));
    } catch (err) {
      error(err instanceof ApiError ? err.message : PRODUCT_CREATE_COPY.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={formStackSpacing} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" spacing={1} sx={pageToolbarRowSx}>
        <IconButton onClick={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">{PRODUCT_CREATE_COPY.title}</Typography>
      </Stack>

      <TextField
        label={PRODUCT_CREATE_COPY.nameLabel}
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register("name")}
      />
      <TextField
        select
        label={PRODUCT_CREATE_COPY.categoryLabel}
        defaultValue={PRODUCT_CREATE_CONFIG.defaultValues.category}
        {...register("category")}
      >
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={quantityRowSpacing}>
        <TextField
          label={PRODUCT_CREATE_COPY.quantityLabel}
          type="number"
          fullWidth
          inputProps={PRODUCT_CREATE_CONFIG.quantityInputProps}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity?.message}
          {...register("quantity")}
        />
        <TextField
          select
          label={PRODUCT_CREATE_COPY.unitLabel}
          defaultValue={PRODUCT_CREATE_CONFIG.defaultValues.unit}
          sx={unitSelectSx}
          {...register("unit")}
        >
          {Object.entries(UNIT_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
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
      <LoadingButton type="submit" variant="contained" size="large" loading={loading}>
        {PRODUCT_CREATE_COPY.submit}
      </LoadingButton>
    </Stack>
  );
}
